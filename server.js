import express from "express";
import cors from "cors";
import morgan from "morgan";
import fs from "fs";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger middleware
const logger = (req, res, next) => {
    const start = Date.now();

    res.on("finish", () => {
        const duration = Date.now() - start;

        const logMessage =
            `${req.method} ${req.url} ${res.statusCode} ${duration}ms\n`;

        fs.appendFile("server.log", logMessage, (err) => {
            if (err) {
                console.log("Failed to write to log file.");
            }
        });
    });

    next();
};

app.use(logger);


// Validation middleware
const validate = (req, res, next) => {
    const { name, age, ward } = req.body;

    if (!name || !age || !ward) {
        const err = new Error("Patient details missing");
        err.statusCode = 400;
        return next(err);
    }

    next();
};


// POST - Create patient
app.post("/api/v1/patient", validate, (req, res) => {
    res.status(201).send("Patient record created successfully");
});


// GET - All patients / filter by ward
app.get("/api/v1/patients", (req, res) => {
    const ward = req.query.ward;

    if (ward) {
        res.status(200).send(
            `${ward} patient records fetched successfully`
        );
    } else {
        res.status(200).send(
            "All patient records fetched successfully"
        );
    }
});


// GET - Patient by ID
app.get("/api/v1/patient/:id", (req, res) => {
    const id = req.params.id;

    res.status(200).send(
        `Patient record with ID ${id} fetched successfully`
    );
});


// PUT - Update patient
app.put("/api/v1/patient/:id", (req, res) => {
    const id = req.params.id;

    res.status(200).send(
        `Patient record with ID ${id} updated successfully`
    );
});


// DELETE - Delete patient
app.delete("/api/v1/patient/:id", (req, res) => {
    const id = req.params.id;

    res.status(200).send(
        `Patient record with ID ${id} deleted successfully`
    );
});


// 404 middleware
app.use((req, res) => {
    res.status(404).send("Page not found");
});


// Error-handling middleware
app.use((err, req, res, next) => {
    const errCode = err.statusCode || 500;
    const message = err.message || "Internal server error";

    res.status(errCode).send(message);
});


// Start server
const PORT = 6500;

app.listen(PORT, () => {
    console.log(
        `Server is running on http://localhost:${PORT}`
    );
});