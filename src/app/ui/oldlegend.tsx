"use client";

import * as d3 from "d3";
import ColorBar from "./ColorBar"; // assumes your colorbar is in same folder
import { Dataset } from "@/app/types/datasets";

type LegendProps = {
  dataset: Dataset | null;
};

export default function Legend({ dataset }: LegendProps) {
  if (!dataset) return null;

  if (dataset.data_type_type === "continuous") {
    return (
      <ColorBar
        label={`${dataset.data_type_name} (${dataset.data_type_unit})`}
        min={dataset.data_type_min_val}
        max={dataset.data_type_max_val}
        tickCount={5}
        width={400}
        height={50}
      />
    );
  }

  if (dataset.data_type_type === "categorical") {
    const colorScale = d3
      .scaleOrdinal(d3.schemeCategory10)
      .domain(dataset.data_type_categories.map(String));

    return (
      <div className="bg-white bg-opacity-80 p-2 rounded shadow text-sm">
        {dataset.data_type_categories.map((cat, i) => (
          <div key={i} className="flex items-center gap-2 mb-1">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: colorScale(String(cat)) }}
            ></div>
            <span>{dataset.data_type_labels[i]}</span>
          </div>
        ))}
      </div>
    );
  }

  return null;
}