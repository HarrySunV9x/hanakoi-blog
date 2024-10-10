const LLM_ADDRESS = "http://localhost:3001/invoke";

export async function fetchNormalData(prompt) {
    try {
        const response = await fetch(LLM_ADDRESS, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "speaker": "举手",
                "type": "hana",
                "model": "llama3.1",
                "prompt": prompt
            })
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error Fetch NormalData:', error);
        throw error; // Throw the error so it can be caught in the calling function
    }
}
