const getToken = (req, res) => {
  const httpToken = req.cookies.token || null;

  if(!httpToken) {
    res.status(401).json({ message: 'Acess denied.' });
    return;
  }

  return httpToken;
}

module.exports = getToken;