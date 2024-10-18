import { createClient } from "@/utils/supabase/server";

export default async function handler(req, res) {
  console.log("Webhook called");
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
  }
  const { urlId, url, deviceType, output } = req.body;

  if (!urlId && !url && !deviceType && !output) {
    res.status(400).json({ message: "Invalid request" });
  }

  const supabase = createClient({ req, res });
  const { data, error } = await supabase.from("lh_results").insert([
    {
      lh_id: urlId,
      html: output[0]
    },
  ]);

  if (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }

  res.status(200).json({
    message: "Success",
    data,
  });
}
