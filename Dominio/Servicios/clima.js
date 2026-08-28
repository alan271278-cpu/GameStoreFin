const URL_CLIMA = "https://api.open-meteo.com/v1/forecast?latitude=-34.9011&longitude=-56.1645&current=temperature_2m";

export async function obtenerClima() {
    const respuesta = await fetch(URL_CLIMA);

    if (!respuesta.ok) {
        throw new Error("Error al consultar la API del clima");
    }

    const datos = await respuesta.json();

    return {
        temperatura: datos.current.temperature_2m
    };
}
