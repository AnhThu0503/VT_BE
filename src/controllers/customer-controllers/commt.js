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

      const comment = await queryMysql(
        `SELECT 
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
            danhgia.SP_id = ${id}`
      );

      res.json(comment);
    } catch (e) {
      console.error(e);
    }
  }
}

module.exports = new CommentController();
