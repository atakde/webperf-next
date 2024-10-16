import { createClient } from "@/utils/supabase/server";

export default async function handler(req, res) {
  const supabase = createClient({ req, res });
  const { urlId } = req.query;

  res.status(200).json({ name: urlId });

  const { data, error } = await supabase.from("lh").select();
}
