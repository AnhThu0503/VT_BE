use soctrangspecial;

create table giohang(
	GH_id int primary key auto_increment,
    ND_id int,
    foreign key (ND_id) references nguoi_dung(ND_id) on delete cascade
);

create table sp_giohang(
	SPGH_id int primary key auto_increment,
    GH_id int,
    SP_id int,
    soLuong int default 1,
    foreign key(GH_id) references giohang(GH_id) on delete cascade,
    foreign key(SP_id) references sanpham(SP_id) on delete cascade
);
create table KHUYENMAI(
	KM_id int primary key auto_increment,
    SP_id int,
    KM_tenGiamGia varchar(256),
    KM_ngayBatDau date,
    KM_ngayKetThuc date,
    KM_mucGiamGia float,
    foreign key(SP_id) references SANPHAM(SP_id) on delete cascade
);
drop table KHUYENMAI;
insert into KHUYENMAI(SP_id,KM_maCode,KM_ngayPhatHanh,KM_soTien,KM_trangThai)value(6,'abc',)
create table DANHGIASP(
	DGSP_id int primary key auto_increment,
    ND_id int,
    SP_id int,
    DGSP_soSao int,
    DGSP_noiDung text,
	DGSP_ngayDanhGia date, 
	foreign key(ND_id) references NGUOI_DUNG(ND_id) on delete cascade,
    foreign key(SP_id) references SANPHAM(SP_id) on delete cascade
);
select sum(soLuong) as sum from sp_giohang, giohang where giohang.GH_id=sp_giohang.GH_id;