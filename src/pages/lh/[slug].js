// import Header from "@/components/Header";
import { createClient } from "@/utils/supabase/client";
import { Progress, Input, Spinner } from "@nextui-org/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Results = () => {
  const router = useRouter();
  const { slug: id } = router.query;
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isResultsLoading, setIsResultsLoading] = useState(false);
  const supabase = createClient();

  const fetchResults = async (showLoading = true) => {
    if (showLoading) {
      setIsLoading(true);
    }

    try {
      const { data: lhData, error } = await supabase
        .from('lh')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      const results = await supabase
        .from('lh_results')
        .select('*')
        .eq('lh_id', id)
        .single();

      if (!results.data) {
        setIsResultsLoading(true);
      } else {
        setIsResultsLoading(false);
      }

      setResults({
        lh: lhData,
        ...results.data,
      });

    } catch (error) {
      setError(error);
      console.error('Error fetching results :: ', error);
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
    }
  };

  const subscribeToChanges = () => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
        },
        (payload) => {
          console.log('Change received!', payload);
          const isTableMatch = payload.table === 'lh_results';
          if (!isTableMatch) {
            return;
          }

          const isIdMatch = payload.new.lh_id === id;
          if (!isIdMatch) {
            return;
          }

          fetchResults(false);
        }
      )
      .subscribe();

    console.log('Subscribed to changes');
    console.log('Channel :: ', channel);

    return () => {
      channel.unsubscribe();
    }
  };

  useEffect(() => {
    if (id) {
      fetchResults();
    }
    return subscribeToChanges();
  }, [id]);

  const renderHTML = html => {
    if (!html) {
      return '';
    }
    // inject styles
    const style = `
      <style>
        .lh-topbar {
          display: none !important;
        }
      </style>
    `;

    const htmlWithStyle = html.replace('<body>', `${style}</body>`);
    return htmlWithStyle;
  }

  const render = () => {
    const hasData = (results && results.lh) ? true : false;
    const hasError = error ? true : false;

    switch (true) {
      case isLoading:
        return (
          <div className="flex items-center justify-center h-screen">
            <Spinner size="large" />
          </div>
        )
      case hasError:
        return <div>Error: {error.message}</div>;
      case hasData:
        return (
          <div className="mx-auto px-6 pt-14 lg:px-8">
            <div className="mx-auto">
              <div className="flex flex-col align-center items-center w-full">
                <div className='flex flex-col gap-4 max-w-4xl w-full'>
                  <Input
                    type="url"
                    placeholder="example.com"
                    labelPlacement="inside"
                    label="Website URL"
                    value={results?.lh?.url}
                    disabled
                    startContent={
                      <div className="pointer-events-none flex items-center">
                        <span className="text-default-400 text-small">https://</span>
                      </div>
                    }
                  />
                </div>
                <div className='flex flex-col gap-4 max-w-4xl w-full'>
                  <div className="flex gap-4 mt-4">
                    <div className="flex gap-2">
                      <label className="font-semibold">Device:</label>
                      <span>{results?.lh?.device}</span>
                    </div>
                    <div className="flex gap-2">
                      <label className="font-semibold">Region:</label>
                      <span>{results?.lh?.region}</span>
                    </div>
                    <div className="flex gap-2">
                      <label className="font-semibold">Date:</label>
                      <span>{results?.created_at ? new Date(results.created_at).toLocaleString() : ''}</span>
                    </div>
                  </div>
                </div>
              </div>
              {(isResultsLoading && !results?.html) && (
                <div className="flex justify-center h-screen mt-16">
                  <Progress
                    size="sm"
                    isIndeterminate
                    aria-label="Loading..."
                    className="max-w-md"
                  />
                </div>
              )}
              {!isResultsLoading && (
                <div className="mt-4" style={{ height: 'calc(100vh - 300px)' }}>
                  <iframe
                    srcDoc={renderHTML(results?.html)}
                    title="Lighthouse Results"
                    width="100%"
                    height="100%"
                  />
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {/* <Header /> */}
      {render()}
    </div>
  );
};
export default Results;