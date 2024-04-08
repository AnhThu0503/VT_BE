const queryMysql = require("../../database/mysql.js");

class CommentController {
  async comment(req, res) {
    try {
      const comment =
        await queryMysql(`INSERT INTO DANHGIASP (ND_id, SP_id, DGSP_soSao, DGSP_noiDung, DGSP_ngayDanhGia)
      VALUES (${req.body.ND_id}, ${req.body.SP_id}, ${req.body.sosao}, '${req.body.noidung}',  CURDATE())`);

      res.json(comment);
    } catch (e) {
      console.error(e);
    }
  }
  async getComments(req, res) {
    try {
      const id = req.query.SP_id;

      const comments = await queryMysql(`
            SELECT 
                danhgia.DGSP_id,
                danhgia.DGSP_ngayDanhGia,
                danhgia.DGSP_noiDung,
                danhgia.DGSP_soSao,
                danhgia.ND_id,
                danhgia.SP_id,
                nguoidung.ND_SDT,
                nguoidung.ND_diaChi,
                nguoidung.ND_email,
                nguoidung.ND_gioiTinh,
                nguoidung.ND_matKhau,
                nguoidung.ND_ten
            FROM 
                DANHGIASP AS danhgia
            JOIN 
                NGUOI_DUNG AS nguoidung ON danhgia.ND_id = nguoidung.ND_id
            WHERE 
                danhgia.SP_id = ${id}
        `);

      let totalRating = 0;
      for (let i = 0; i < comments.length; i++) {
        totalRating += comments[i].DGSP_soSao;
      }
      const averageRating =
        comments.length > 0 ? totalRating / comments.length : 0;
      console.log("averageRating", averageRating);
      res.json({ comments, averageRating });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = new CommentController();
