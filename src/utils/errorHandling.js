export const errorHandler = (API) => {
  return (req, res, next) => {
    // Wrap the API function with a try-catch block to handle errors
    API(req, res, next).catch((err) => {
      // Check for specific error codes or patterns
      if (err.code === 11000) {
        // If the error code is 11000 (duplicate key error)
        if (err.keyPattern.email) {
          return res.status(402).json({ message: "Email already exists." });
        }
        if (err.keyPattern.username) {
          return res.status(402).json({ message: "Username already exists." });
        }
      }

      // If the error is not handled above, return a generic server error
      return res.status(500).json({ error: "Internal Server Error", err });
    });
  };
};
