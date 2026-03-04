const adminAuth = (req, res) => {
  const token = "1234";
  const isAuthorized = token === "1234";
  if (isAuthorized) {
    res.send("ADMIN DATA");
  } else {
    res.status(401).send("Authorization error");
  }
};

const userAuth = (req, res) => {
  const token = "8687";
  const valid = token === "8687";
  valid ? res.send("User data") : res.status(401).send("error");
};

module.exports = { adminAuth, userAuth };
