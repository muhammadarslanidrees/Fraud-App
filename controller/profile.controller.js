export class ProfileController {
  static async getUser(req, res) {
    try {
      const user = req.user;

      res.status(200).json({ status: 200, user });
    } catch (error) {
      return res
        .status(500)
        .json({ status: 500, message: "Something went wrong." });
    }
  }
}
