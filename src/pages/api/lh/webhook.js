import { createClient } from "@/utils/supabase/server";

const endpoints = JSON.parse(process.env.ENDPOINTS ?? '{}');

export default async function handler(req, res) {
  const supabase = createClient({ req, res });
  const { urlId } = req.query;

  const { data, error } = await supabase.from("lh").select();
}
