export default async function (error, req, res, next) {
    res.status(error.status || 500).send({
        status: "error",
        message: error.message
    });
}