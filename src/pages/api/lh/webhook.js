import { createClient } from "@/utils/supabase/server";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
  }
  const { urlId, url, deviceType, output } = req.body;

  if (!urlId && !url && !deviceType && !output) {
    res.status(400).json({ message: "Invalid request" });
  }

  // const supabase = createClient({ req, res });

  console.log(urlId, url, deviceType, output);

  res.status(200).json({ message: "Debugging" });

  // const { data, error } = await supabase.from("lh").select();
}
