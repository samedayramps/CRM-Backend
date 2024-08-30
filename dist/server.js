"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const customerRoutes_1 = __importDefault(require("./routes/customerRoutes"));
const jobRoutes_1 = __importDefault(require("./routes/jobRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const settingsRoutes_1 = __importDefault(require("./routes/settingsRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// CORS options configuration
const corsOptions = {
    origin: ['https://your-netlify-domain.netlify.app', 'https://your-custom-domain.com'], // Replace with your actual domain
    optionsSuccessStatus: 200,
};
app.use((0, cors_1.default)(corsOptions)); // Use configured CORS options
app.use(express_1.default.json());
mongoose_1.default.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('MongoDB connection error:', error));
app.use('/api/customers', customerRoutes_1.default);
app.use('/api/jobs', jobRoutes_1.default);
app.use('/api/auth', authRoutes_1.default);
app.use('/api/settings', settingsRoutes_1.default);
const PORT = process.env.PORT || 3001;
const server = http_1.default.createServer(app);
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}).on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
        console.log('Port is busy, trying the next one...');
        server.listen(0, () => {
            const address = server.address();
            if (address && typeof address !== 'string') {
                console.log(`Server is running on port ${address.port}`);
            }
            else {
                console.log('Server is running on an unknown port');
            }
        });
    }
    else {
        console.error('Failed to start server:', e);
    }
});
