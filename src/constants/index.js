// seperate later

const REGIONS = [
  {
    key: 'us-east-1',
    label: 'N. Virginia',
  },
  {
    key: 'eu-central-1',
    label: 'Frankfurt',
  },
  {
    key: 'ap-south-1',
    label: 'Mumbai',
  },
  {
    key: 'eu-north-1',
    label: 'Stockholm',
  },
];

const DEVICES = [
  {
    key: 'desktop',
    label: 'Desktop',
  },
  {
    key: 'mobile',
    label: 'Mobile',
  },
];

const MARKER_POSITIONS = [
  { xPercent: 27.5, yPercent: 35.2 },  // N. Virginia
  { xPercent: 51.42, yPercent: 31.0 },  // Frankfurt
  { xPercent: 70.22, yPercent: 49.44 },  // Mumbai
  { xPercent: 53, yPercent: 25 }   // Stockholm
];

export { REGIONS, DEVICES, MARKER_POSITIONS };