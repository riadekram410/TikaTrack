import { useEffect, useState } from "react";
import { useCarbonFootprint } from "react-carbon-footprint";

function CarbonFootprintDisplay() {
    const [gCO2, bytesTransferred] =
        useCarbonFootprint();

    const [showPopup, setShowPopup] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowPopup(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    if (!showPopup) {
        return null;
    }

    return (
        <div
            style={{
                position: "fixed",
                bottom: "30px",
                right: "30px",
                width: "360px",
                background: "#ffffff",
                padding: "25px",
                borderRadius: "20px",
                zIndex: 9999,
                boxShadow: "0 15px 40px rgba(0, 0, 0, 0.15)",
                border: "1px solid #e5eee9",
                animation: "carbonPopup 0.5s ease-out",
            }}
        >

            {/* HEADER */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    marginBottom: "20px",
                }}
            >
                <div
                    style={{
                        width: "55px",
                        height: "55px",
                        borderRadius: "15px",
                        background: "#e8f8ef",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "28px",
                    }}
                >
                    🌱
                </div>

                <div>
                    <h3
                        style={{
                            margin: 0,
                            fontSize: "21px",
                            color: "#163d2b",
                        }}
                    >
                        Network Carbon
                    </h3>

                    <span
                        style={{
                            color: "#718096",
                            fontSize: "15px",
                        }}
                    >
                        Footprint
                    </span>
                </div>
            </div>

            {/* DATA TRANSFERRED */}
            <div
                style={{
                    borderTop: "1px solid #e5e7eb",
                    paddingTop: "16px",
                    marginBottom: "16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <span
                    style={{
                        color: "#718096",
                        fontSize: "15px",
                    }}
                >
                    Data Transferred
                </span>

                <strong
                    style={{
                        color: "#163d2b",
                        fontSize: "19px",
                    }}
                >
                    {(bytesTransferred / 1024).toFixed(2)} KB
                </strong>
            </div>

            {/* CO2 */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "18px",
                }}
            >
                <span
                    style={{
                        color: "#718096",
                        fontSize: "15px",
                    }}
                >
                    Estimated CO₂
                </span>

                <strong
                    style={{
                        color: "#168b4b",
                        fontSize: "19px",
                    }}
                >
                    {gCO2.toFixed(4)}
                    <span
                        style={{
                            fontSize: "12px",
                            color: "#718096",
                            marginLeft: "5px",
                        }}
                    >
                        g CO₂e
                    </span>
                </strong>
            </div>

            {/* LIVE STATUS */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: "#168b4b",
                    fontSize: "14px",
                    fontWeight: "600",
                }}
            >
                <span
                    style={{
                        width: "9px",
                        height: "9px",
                        borderRadius: "50%",
                        background: "#168b4b",
                    }}
                ></span>

                Live calculation
            </div>

            <p
                style={{
                    margin: "12px 0 0",
                    fontSize: "12px",
                    color: "#89949a",
                }}
            >
                Estimated from network data transfer
            </p>

            {/* POPUP ANIMATION */}
            <style>
                {`
                    @keyframes carbonPopup {
                        from {
                            opacity: 0;
                            transform: translateY(25px);
                        }

                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                `}
            </style>

        </div>
    );
}

export default CarbonFootprintDisplay;