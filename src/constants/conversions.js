const unitConversions = {
  length: { m: 1, cm: 100, mm: 1000, km: 0.001, ft: 3.28084, in: 39.3701 },
  area: { sqm: 1, sqkm: 0.000001, sqft: 10.7639, acre: 0.000247105 },
  weight: { kg: 1, g: 1000, lb: 2.20462, oz: 35.274 },
  volume: { l: 1, ml: 1000, gal: 0.264172, qt: 1.05669 },
  temperature: {
    c_to_f: (c) => c * 9 / 5 + 32,
    f_to_c: (f) => (f - 32) * 5 / 9
  }
};

const simpleConverters = {
  time: { s: 1, min: 1/60, hr: 1/3600, day: 1/86400 },
  digital: { b: 1, kb: 1/1024, mb: 1/1024/1024, gb: 1/1024/1024/1024 },
  parts: { ppm: 1, ppb: 1000, ppt: 1000000 },
  speed: { mps: 1, kph: 3.6, mph: 2.23694 },
  pace: { spm: 1, mph: 26.8224, kph: 16.6667 },
  pressure: { pa: 1, kpa: 1/1000, bar: 1/100000, atm: 1/101325 },
  current: { a: 1, ma: 1000, ka: 1/1000 },
  voltage: { v: 1, mv: 1000, kv: 1/1000 },
  power: { w: 1, kw: 1/1000, hp: 1/745.7 },
  reactive: { var: 1, kvar: 1/1000 },
  apparent: { va: 1, kva: 1/1000 },
  energy: { j: 1, kj: 1/1000, cal: 1/4.184, kcal: 1/4184 },
  reactiveEnergy: { varh: 1, kvarh: 1/1000 },
  flow: { lps: 1, lpm: 60, cfs: 35.3147 },
  illuminance: { lx: 1, fc: 1/10.764 },
  frequency: { hz: 1, khz: 1/1000, mhz: 1/1000000 },
  angle: { deg: 1, rad: 1/57.2958 },
  torque: { nm: 1, lbft: 1/1.35582 },
  charge: { c: 1, mc: 1000, ah: 1/3600 }
};

module.exports = { unitConversions, simpleConverters };

