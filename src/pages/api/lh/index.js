import { createClient } from "@/utils/supabase/server";

const endpoints = JSON.parse(process.env.ENDPOINTS ?? '{}');

export default async function handler(req, res) {
  if (req.method !== "POST") {
    // Process a POST request
    res.status(405).json({ message: "Method Not Allowed" });
  }

  const { url, device, region } = req.body;

  if (!url) {
    res.status(400).json({ message: "URL is required" });
  }

  if (!device) {
    res.status(400).json({ message: "Device is required" });
  }

  if (!region) {
    res.status(400).json({ message: "Region is required" });
  }

  let endpoint = endpoints[region];

  if (!endpoint) {
    res.status(400).json({ message: "Invalid region" });
  }

  const urlWithProtocol = url.startsWith('https') ? url : `https://${url}`;
  const supabase = createClient({ req, res });

  const { data, error } = await supabase.from("lh").insert([
    {
      url,
      device,
      region,
      outputOpts: 'html,json'
    },
  ]).select();

  if (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }

  endpoint += `?url=${urlWithProtocol}&device=${device}`;
  endpoint += '&outputOpts=html,json';
  endpoint += `&urlId=${data[0].id}`;

  fetch(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  
  res.status(200).json({
    message: "Success",
    data,
  });
}
