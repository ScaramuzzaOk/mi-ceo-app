import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

// Configuración de FatSecret API
const FATSECRET_CONFIG = {
  consumerKey: "ee7df944d879469390b532e083aa08e",
  consumerSecret: "b93f1107e0f248f48acd93036cccf23e",
  baseUrl: "https://platform.fatsecret.com/rest/server.api",
}

// Función para generar OAuth signature
function generateOAuthSignature(method: string, url: string, params: Record<string, string>, consumerSecret: string) {
  // Ordenar parámetros alfabéticamente
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join("&")

  // Crear signature base string
  const signatureBaseString = [method.toUpperCase(), encodeURIComponent(url), encodeURIComponent(sortedParams)].join(
    "&",
  )

  // Crear signing key
  const signingKey = `${encodeURIComponent(consumerSecret)}&`

  // Generar signature usando HMAC-SHA1
  const signature = crypto.createHmac("sha1", signingKey).update(signatureBaseString).digest("base64")

  return signature
}

// Función para hacer request a FatSecret
async function fatSecretRequest(method: string, params: Record<string, string>) {
  const timestamp = Math.floor(Date.now() / 1000).toString()
  const nonce = crypto.randomBytes(16).toString("hex")

  // Parámetros OAuth
  const oauthParams = {
    oauth_consumer_key: FATSECRET_CONFIG.consumerKey,
    oauth_nonce: nonce,
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: timestamp,
    oauth_version: "1.0",
    method: method,
    format: "json",
    ...params,
  }

  // Generar signature
  const signature = generateOAuthSignature(
    "POST",
    FATSECRET_CONFIG.baseUrl,
    oauthParams,
    FATSECRET_CONFIG.consumerSecret,
  )

  // Agregar signature a los parámetros
  oauthParams.oauth_signature = signature

  // Crear form data
  const formData = new URLSearchParams()
  Object.entries(oauthParams).forEach(([key, value]) => {
    formData.append(key, value)
  })

  console.log("FatSecret Request:", method, params)

  try {
    const response = await fetch(FATSECRET_CONFIG.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Miceo-Nutrition-App/1.0",
      },
      body: formData.toString(),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("FatSecret API Error:", response.status, errorText)
      throw new Error(`FatSecret API error: ${response.status}`)
    }

    const data = await response.json()
    console.log("FatSecret Response:", data)
    return data
  } catch (error) {
    console.error("FatSecret API request failed:", error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  let query = ""
  try {
    const { query: searchQuery } = await request.json()
    query = searchQuery

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ foods: [] })
    }

    console.log("Searching for:", query)

    // Buscar alimentos en FatSecret
    const searchResults = await fatSecretRequest("foods.search", {
      search_expression: query.trim(),
      max_results: "20",
    })

    // Procesar resultados
    const foods = []

    if (searchResults.foods && searchResults.foods.food) {
      const foodList = Array.isArray(searchResults.foods.food) ? searchResults.foods.food : [searchResults.foods.food]

      // Procesar hasta 10 alimentos
      for (const food of foodList.slice(0, 10)) {
        try {
          // Obtener información nutricional detallada
          const foodDetails = await fatSecretRequest("food.get", {
            food_id: food.food_id,
          })

          if (foodDetails.food && foodDetails.food.servings) {
            const servings = foodDetails.food.servings.serving
            const serving = Array.isArray(servings) ? servings[0] : servings

            const processedFood = {
              id: food.food_id,
              name: food.food_name,
              calories: Math.round(Number.parseFloat(serving.calories) || 0),
              protein: Math.round((Number.parseFloat(serving.protein) || 0) * 10) / 10,
              carbs: Math.round((Number.parseFloat(serving.carbohydrate) || 0) * 10) / 10,
              fat: Math.round((Number.parseFloat(serving.fat) || 0) * 10) / 10,
              fiber: Math.round((Number.parseFloat(serving.fiber) || 0) * 10) / 10,
              sugar: Math.round((Number.parseFloat(serving.sugar) || 0) * 10) / 10,
              sodium: Math.round((Number.parseFloat(serving.sodium) || 0) * 10) / 10,
              per: serving.serving_description || "100g",
              brand: food.brand_name || null,
            }

            foods.push(processedFood)
          }
        } catch (error) {
          console.error(`Error getting details for food ${food.food_id}:`, error)
          // Continuar con el siguiente alimento
        }
      }
    }

    // Si no hay resultados de la API, usar datos de respaldo
    if (foods.length === 0) {
      const backupFoods = getBackupFoods(query)
      return NextResponse.json({ foods: backupFoods })
    }

    return NextResponse.json({ foods })
  } catch (error) {
    console.error("Error in FatSecret search:", error)

    // En caso de error, devolver datos de respaldo
    const backupFoods = getBackupFoods(query || "")
    return NextResponse.json({ foods: backupFoods })
  }
}

// Función de respaldo con alimentos comunes
function getBackupFoods(query: string) {
  const commonFoods = [
    {
      id: "backup-1",
      name: "Pollo pechuga sin piel",
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      fiber: 0,
      sugar: 0,
      sodium: 74,
      per: "100g",
      brand: null,
    },
    {
      id: "backup-2",
      name: "Banana mediana",
      calories: 105,
      protein: 1.3,
      carbs: 27,
      fat: 0.4,
      fiber: 3.1,
      sugar: 14.4,
      sodium: 1,
      per: "1 mediana (118g)",
      brand: null,
    },
    {
      id: "backup-3",
      name: "Avena integral",
      calories: 68,
      protein: 2.4,
      carbs: 12,
      fat: 1.4,
      fiber: 1.7,
      sugar: 0.8,
      sodium: 2,
      per: "30g",
      brand: null,
    },
    {
      id: "backup-4",
      name: "Arroz integral cocido",
      calories: 111,
      protein: 2.6,
      carbs: 23,
      fat: 0.9,
      fiber: 1.8,
      sugar: 0.4,
      sodium: 5,
      per: "100g",
      brand: null,
    },
    {
      id: "backup-5",
      name: "Yogur griego natural",
      calories: 100,
      protein: 10,
      carbs: 6,
      fat: 5,
      fiber: 0,
      sugar: 6,
      sodium: 50,
      per: "100g",
      brand: "Natural",
    },
    {
      id: "backup-6",
      name: "Huevo entero",
      calories: 155,
      protein: 13,
      carbs: 1.1,
      fat: 11,
      fiber: 0,
      sugar: 1.1,
      sodium: 124,
      per: "100g (2 huevos grandes)",
      brand: null,
    },
    {
      id: "backup-7",
      name: "Salmón atlántico",
      calories: 208,
      protein: 25,
      carbs: 0,
      fat: 12,
      fiber: 0,
      sugar: 0,
      sodium: 59,
      per: "100g",
      brand: null,
    },
    {
      id: "backup-8",
      name: "Brócoli cocido",
      calories: 35,
      protein: 2.4,
      carbs: 7,
      fat: 0.4,
      fiber: 3.3,
      sugar: 2.2,
      sodium: 41,
      per: "100g",
      brand: null,
    },
  ]

  return commonFoods.filter((food) => food.name.toLowerCase().includes(query.toLowerCase()))
}
