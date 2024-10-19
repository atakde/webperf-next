import { useState } from "react";
import { Select, SelectItem, Input } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import GlobalOutlined from '@ant-design/icons/GlobalOutlined';
import DesktopOutlined from '@ant-design/icons/DesktopOutlined';
import MobileOutlined from '@ant-design/icons/MobileOutlined';
import { REGIONS, DEVICES, MARKER_POSITIONS } from "@/constants";
import Header from "@/components/Header";
import { useRouter } from "next/router";
import ImageWithMarkers from "@/components/MarkedImage/MarkedImage";
import MarkedImage from "@/components/MarkedImage/MarkedImage";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    url: '',
    region: 'us-east-1',
    device: 'desktop',
  });

  const handleChange = (value, name) => {
    console.log(value, name);
    setData({
      ...data,
      [name]: value,
    });
  }

  const handleUrlChange = url => {
    const urlWithoutProtocol = url
      .replace('https://', '')
      .replace('http://', '');
    setData({
      ...data,
      url: urlWithoutProtocol,
    });
  }

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/lh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const result = await response.json();
      if (result?.data?.id) {
        router.push(`/lh/${result.data.id}`);
      }
    }
    catch (error) {
      console.error(error);
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          {/* <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
              4 new regions available now. {' '}
              <a href="#" className="font-semibold text-indigo-600">
                <span aria-hidden="true" className="absolute inset-0" />
                Read more <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div> */}
          <div className="text-center">
            <h1 className="text-balance text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              See how your website performs
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">Get regional lighthouse scores for your website in seconds</p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <div className='flex flex-col items-center justify-center'>
                <div className='flex flex-col gap-4 w-full max-w-xl px-4 mt-8'>
                  <div className='flex flex-col gap-4'>
                    <Input
                      type="url"
                      placeholder="example.com"
                      labelPlacement="outside"
                      label="Website URL"
                      classNames={{
                        base: "max-w-xl",
                      }}
                      value={data.url}
                      onChange={(e) => handleUrlChange(e.target.value)}
                      startContent={
                        <div className="pointer-events-none flex items-center">
                          <span className="text-default-400 text-small">https://</span>
                        </div>
                      }
                    />
                  </div>
                  <div className='flex gap-4'>
                    <Select
                      label="Location"
                      placeholder="Select a location"
                      labelPlacement="outside"
                      defaultSelectedKeys={['us-east-1']}
                      startContent={<GlobalOutlined />}
                      onChange={(value) => handleChange(value, 'region')}
                      popoverProps={{
                        classNames: {
                          base: "before:bg-default-200",
                          content: "p-0 border-small border-divider bg-background",
                        },
                      }}
                    >
                      {REGIONS.map((each) => (
                        <SelectItem
                          title={each.label}
                          key={each.key}
                        >
                          {each.label}
                        </SelectItem>
                      ))}
                    </Select>
                    <Select
                      items={DEVICES}
                      label="Device"
                      placeholder="Select a device"
                      labelPlacement="outside"
                      defaultSelectedKeys={['desktop']}
                      popoverProps={{
                        classNames: {
                          base: "before:bg-default-200",
                          content: "p-0 border-small border-divider bg-background",
                        },
                      }}
                      renderValue={(items) => {
                        return items.map((item) => (
                          <div key={item.key} className="flex items-center gap-2">
                            {item.key === 'desktop' ? <DesktopOutlined /> : <MobileOutlined />}
                            <div className="flex flex-col">
                              <span>{item.data.label}</span>
                            </div>
                          </div>
                        ));
                      }}
                    >
                      {(device) => (
                        <SelectItem key={device.key} textValue={device.label}>
                          <div className="flex gap-2 items-center">
                            {device.key === 'desktop' ? <DesktopOutlined /> : <MobileOutlined />}
                            <div className="flex flex-col">
                              <span className="text-small">{device.label}</span>
                            </div>
                          </div>
                        </SelectItem>
                      )}
                    </Select>
                  </div>
                  <Button
                    type="primary"
                    className="mt-4"
                    size="large"
                    onClick={handleSubmit}
                    isLoading={loading}
                    spinner={
                      <svg
                        className="animate-spin h-5 w-5 text-current"
                        fill="none"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          fill="currentColor"
                        />
                      </svg>
                    }
                  >{loading ? 'Processing...' : 'Start Test'}</Button>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mt-4">By clicking on Start Test, you agree to our <a href="#" className="text-primary-600">Terms of Service</a> and <a href="#" className="text-primary-600">Privacy Policy</a></p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          />
        </div>
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Supported Regions</h2>
          <p className="mt-4 text-lg text-gray-600">
            We support the following regions for testing your website
          </p>
        </div>
        <div className="flex items-center justify-center mt-16 -mx-8 sm:-mx-0">
          <MarkedImage
            imageUrl="/world.png"
            initialMarkers={MARKER_POSITIONS}
          />
        </div>
        </div>
      </>
      );
}
