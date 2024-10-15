from fastapi import FastAPI,Request, HTTPException
import httpx
from aiModel import generate_report
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/route_report")
async def proxy(request: Request):
    json_data = await request.json()
    api_key = request.headers.get("X-API-Key")
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://developer.nrel.gov/api/routee/v3/compass/route",
            params={"api_key": api_key},
            json=json_data
        )
    
    return response.json()

@app.get("/generate_report/{district}")
async def get_report(district: str):
    try:
        report = generate_report(district)
        return {"report": report}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
