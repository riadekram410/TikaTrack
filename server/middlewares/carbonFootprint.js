import { co2 } from "@tgwf/co2";

const co2Emission = new co2({
    model: "swd",
});

const carbonFootprint = (req, res, next) => {
    let requestBytes = 0;
    let responseBytes = 0;

    // Calculate request size
    if (req.body) {
        requestBytes += Buffer.byteLength(
            JSON.stringify(req.body),
            "utf8"
        );
    }

    if (req.query) {
        requestBytes += Buffer.byteLength(
            JSON.stringify(req.query),
            "utf8"
        );
    }

    if (req.headers) {
        requestBytes += Buffer.byteLength(
            JSON.stringify(req.headers),
            "utf8"
        );
    }

    // Override res.write to calculate response size
    const originalWrite = res.write;
    const originalEnd = res.end;

    res.write = function (chunk) {
        if (chunk) {
            responseBytes += Buffer.byteLength(
                chunk,
                "utf8"
            );
        }

        originalWrite.apply(res, arguments);
    };

    res.end = function (chunk) {
        if (chunk) {
            responseBytes += Buffer.byteLength(
                chunk,
                "utf8"
            );
        }

        // Store total bytes
        const totalBytes = requestBytes + responseBytes;

        // Calculate carbon emissions
        // false = server is not hosted on a green host
        const greenHost = false;

        const emissions = co2Emission.perByte(
            totalBytes,
            greenHost
        );

        console.log(
            `Data transferred: ${totalBytes} bytes`
        );

        console.log(
            `Estimated CO2 emissions: ${emissions.toFixed(3)} grams`
        );

        originalEnd.apply(res, arguments);
    };

    next();
};

export default carbonFootprint;