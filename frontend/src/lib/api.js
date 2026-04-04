export async function analyzeJob(request) {
  const resp = await fetch(`${import.meta.env.VITE_API_URL}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  
  if (!resp.ok) throw new Error("Analysis failed");
  return resp.json();
}