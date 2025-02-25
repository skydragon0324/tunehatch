export const generateQROptions = () => {
    let options = {
        width: 300,
        height: 300,
        dotsOptions: {
            type: "dots",
            color: "#000000",
        },
        backgroundOptions: {
            color: "#ffffff",
        },
        imageOptions: {
            hideBackgroundDots: true,
            imageSize: 0.25,
            margin: 2,
        },
        cornersDotOptions: {
            color: "#f99d1b",
            type: "dot",
        },
        cornersSquareOptions: {
            color: "#4A4A4A",
            type: "extra-rounded",
        },
    };
    return options;
};
