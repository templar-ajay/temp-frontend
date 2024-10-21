export async function POST() {
  const data = {
    success: true,
    data: "form submitted successfully",
  };
  return new Response(JSON.stringify({ success: "false" }), {
    status: 201,
    statusText: "response code not 201",
  });
}
