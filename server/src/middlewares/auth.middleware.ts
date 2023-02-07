import { requiredScopes } from "express-oauth2-jwt-bearer";
import { AUTH0_AUDIENCE, AUTH0_ISSUER } from "@config";

const { auth } = require("express-oauth2-jwt-bearer");

export const authMiddleware = auth({
  audience: AUTH0_AUDIENCE,
  issuerBaseURL: AUTH0_ISSUER
});

export const isAdminMiddleware = requiredScopes("admin:admin");

export const isEditorMiddleware = requiredScopes('editor:editor');
