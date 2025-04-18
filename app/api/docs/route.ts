import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    openapi: "3.0.0",
    info: {
      title: "Office Booking API",
      version: "1.0.0",
      description: "API for the Office Booking application",
    },
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Development server",
      },
    ],
    paths: {
      "/auth/login": {
        post: {
          summary: "User login",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    email: { type: "string", format: "email" },
                    password: { type: "string" },
                  },
                  required: ["email", "password"],
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Successful login",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      user: {
                        type: "object",
                        properties: {
                          id: { type: "string" },
                          email: { type: "string" },
                          name: { type: "string" },
                          role: { type: "string" },
                          token: { type: "string" },
                        },
                      },
                    },
                  },
                },
              },
            },
            "401": {
              description: "Invalid credentials",
            },
          },
        },
      },
      "/auth/register": {
        post: {
          summary: "User registration",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    first_name: { type: "string" },
                    last_name: { type: "string" },
                    email: { type: "string", format: "email" },
                    role: { type: "string", enum: ["Manager", "Employee"] },
                    password: { type: "string" },
                  },
                  required: ["first_name", "last_name", "email", "role", "password"],
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Successful registration",
            },
            "400": {
              description: "Invalid input",
            },
          },
        },
      },
      "/bookings": {
        get: {
          summary: "Get all bookings",
          responses: {
            "200": {
              description: "List of bookings",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        roomName: { type: "string" },
                        bookingDate: { type: "string", format: "date" },
                        startTime: { type: "string" },
                        endTime: { type: "string" },
                        userId: { type: "string" },
                        userName: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          summary: "Create a new booking",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    roomName: { type: "string" },
                    bookingDate: { type: "string", format: "date" },
                    startTime: { type: "string" },
                    endTime: { type: "string" },
                  },
                  required: ["roomName", "bookingDate", "startTime", "endTime"],
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Booking created successfully",
            },
            "400": {
              description: "Invalid input",
            },
          },
        },
      },
      "/bookings/{id}": {
        get: {
          summary: "Get booking by ID",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
            },
          ],
          responses: {
            "200": {
              description: "Booking details",
            },
            "404": {
              description: "Booking not found",
            },
          },
        },
        put: {
          summary: "Update booking",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    roomName: { type: "string" },
                    bookingDate: { type: "string", format: "date" },
                    startTime: { type: "string" },
                    endTime: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Booking updated successfully",
            },
            "400": {
              description: "Invalid input",
            },
            "404": {
              description: "Booking not found",
            },
          },
        },
        delete: {
          summary: "Delete booking",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
            },
          ],
          responses: {
            "200": {
              description: "Booking deleted successfully",
            },
            "404": {
              description: "Booking not found",
            },
          },
        },
      },
      // Additional endpoints would be documented here
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  })
}
