import BASEMAPS from "../lib/basemaps";

type Props = {
    basemap: string;
    setBasemap: (name: string) => void;
  };
  
  export default function BasemapSelector({ basemap, setBasemap }: Props) {
    return (
      <div className="absolute top-4 left-4 z-10 bg-white border p-2">
        <label className="text-sm mr-2">Basemap:</label>
        <select
          value={basemap}
          onChange={(e) => setBasemap(e.target.value)}
          className="text-sm border px-1"
        >
          {Object.keys(BASEMAPS).map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
    );
  }