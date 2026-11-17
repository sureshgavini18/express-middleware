
import express from "express";
import cors from "cors";
import morgan from "morgan";
import fs from "fs";

const app = express();

// ==================================
// 1. BUILT-IN & THIRD-PARTY MIDDLEWARE
// ==================================

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================================
// 2. LOGGER MIDDLEWARE
// ==================================

const logger = (req, res, next) => {
    const start = Date.now();

    res.on("finish", () => {
        const duration = Date.now() - start;

        const logMessage =
            `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms\n`;

        fs.appendFile("server.log", logMessage, (err) => {
            if (err) {
                console.log("Failed to write to log file.");
            }
        });
    });

    next();
};

app.use(logger);

// ==================================
// 3. VALIDATION MIDDLEWARE
// ==================================

const validate = (req, res, next) => {
    const { name, age, ward } = req.body;

    if (!name || !age || !ward) {
        const err = new Error("Patient details missing");
        err.statusCode = 400;
        return next(err);
    }

    next();
};

// ==================================
// 4. HOME ROUTE
// ==================================

app.get("/", (req, res) => {
    res.status(200).send(
        "Patient Management API is running successfully!"
    );
});

// ==================================
// 5. POST - CREATE PATIENT
// ==================================

app.post("/api/v1/patient", validate, (req, res) => {
    res.status(201).send(
        "Patient record created successfully"
    );
});

// ==================================
// 6. GET - ALL PATIENTS / FILTER BY WARD
// ==================================

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

// ==================================
// 7. GET - PATIENT BY ID
// ==================================

app.get("/api/v1/patient/:id", (req, res) => {
    const id = req.params.id;

    res.status(200).send(
        `Patient record with ID ${id} fetched successfully`
    );
});

// ==================================
// 8. PUT - UPDATE PATIENT
// ==================================

app.put("/api/v1/patient/:id", (req, res) => {
    const id = req.params.id;

    res.status(200).send(
        `Patient record with ID ${id} updated successfully`
    );
});

// ==================================
// 9. DELETE - DELETE PATIENT
// ==================================

app.delete("/api/v1/patient/:id", (req, res) => {
    const id = req.params.id;

    res.status(200).send(
        `Patient record with ID ${id} deleted successfully`
    );
});

// ==================================
// 10. 404 ERROR MIDDLEWARE
// ==================================

app.use((req, res) => {
    res.status(404).send("Page not found");
});

// ==================================
// 11. ERROR-HANDLING MIDDLEWARE
// ==================================

app.use((err, req, res, next) => {
    const errCode = err.statusCode || 500;
    const message = err.message || "Internal server error";

    res.status(errCode).send(message);
});

// ==================================
// 12. START SERVER
// ==================================

const PORT = 6500;

app.listen(PORT, () => {
    console.log(
        `Server is running on http://localhost:${PORT}`
    );
});
