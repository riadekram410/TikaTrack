import { useCarbonFootprint } from "react-carbon-footprint";

function CarbonFootprintDisplay() {
    const [gCO2, bytesTransferred] =
        useCarbonFootprint();

    return (
        <div
            style={{
                position: "fixed",
                bottom: "10px",
                right: "10px",
                background: "rgba(255, 255, 255, 0.95)",
                padding: "10px 15px",
                borderRadius: "8px",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.15)",
                zIndex: 1000,
                fontSize: "14px",
            }}
        >
            <strong>Network Carbon Footprint</strong>

            <p>
                Data Transferred: {bytesTransferred} bytes
            </p>

            <p>
                CO₂ Emissions: {gCO2.toFixed(6)} grams CO₂eq
            </p>
        </div>
    );
}

export default CarbonFootprintDisplay;