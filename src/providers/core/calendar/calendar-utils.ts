import { Utils } from "../app/utils";



export class CalendarUtils {

    private static GMT: number = 7;
    private static day_in_months: Array<number> = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    private static day_in_months_nhuan: Array<number> = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    private static _CAN: Array<string> = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
    private static _CHI: Array<string> = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];
    private static NAME_OF_DAYS: Array<string> = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
    private static WEEK_DAYS: Array<string> = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

    private static ZODIACTIME: any[] = [
        {
            can: ["Giáp", "Kỷ"], ti: "Giáp Tý", suu: "Ất Sửu", dan: "Bính Dần", mao: "Đinh Mão", thin: "Mậu Thìn ", ty: "Kỷ Tỵ", ngo: "Canh Ngọ", mui: "Tân Mùi", than: "Nhâm Thân", dau: "Quý Dậu", tuat: "Giáp Tuất", hoi: "Ất Hợi"
        },
        {
            can: ["Ất", "Canh"], ti: "Bính Tý", suu: "Đinh Sửu", dan: "Mậu Dần", mao: "Kỷ Mão", thin: "Canh Thìn ", ty: "Tân Tỵ", ngo: "Nhâm Ngọ", mui: "Quý Mùi", than: "Giáp Thân", dau: "Ất Dậu", tuat: "Bính Tuất", hoi: "Đinh Hợi"
        },
        {
            can: ["Bính", "Tân"], ti: "Mậu Tý", suu: "Kỷ Sửu", dan: "Canh Dần", mao: "Tân Mão", thin: "Nhâm Thìn ", ty: "Quý Tỵ", ngo: "Giáp Ngọ", mui: "Ất Mùi", than: "Bính Thân", dau: "Đinh Dậu", tuat: "Mậu Tuất", hoi: "Kỷ Hợi"
        },
        {
            can: ["Đinh", "Nhâm"], ti: "Canh Tý", suu: "Tân Sửu", dan: "Nhâm Dần", mao: "Quý Mão", thin: "Giáp Thìn ", ty: "Ất Tỵ", ngo: "Bính Ngọ", mui: "Đinh Mùi", than: "Mậu Thân", dau: "Kỷ Dậu", tuat: "Canh Tuất", hoi: "Tân Hợi"
        },
        {
            can: ["Mậu", "Quý"], ti: "Nhâm Tý", suu: "Quý Sửu", dan: "Giáp Dần", mao: "Ất Mão", thin: "Bính Thìn ", ty: "Đinh Tỵ", ngo: "Mậu Ngọ", mui: "Kỷ Mùi", than: "Canh Thân", dau: "Tân Dậu", tuat: "Nhâm Tuất", hoi: "Quý Hợi"
        }
    ];
    private static HOURS = [
        {
            chi: "Dần,Thân",
            gio_tot: "Tý(23-1), Sửu(1-3), Thìn(7-9), Tỵ(9-11), Mùi(13-15), Tuất(19-21)",
            gio_xau: "Dần(3-5), Mão(5-7), Ngọ(11-13), Thân(15-17), Dậu(17-19), Hợi(21-23)"
        },
        {
            chi: "Mão,Dậu",
            gio_tot: "Tý(23-1), Dần(3-5), Mão(5-7), Ngọ(11-13), Mùi(13-15), Dậu(17-19)",
            gio_xau: "Sửu(1-3), Thìn(7-9), Tỵ(9-11), Thân(15-17), Tuất(19-21), Hợi(21-23)"
        },
        {
            chi: "Thìn,Tuất",
            gio_tot: "Dần(3-5), Thìn(7-9), Tỵ(9-11), Thân(15-17), Dậu(17-19), Hợi(21-23)",
            gio_xau: "Tý(23-1), Sửu(1-3), Mão(5-7), Ngọ(11-13), Mùi(13-15), Tuất(19-21)"
        },
        {
            chi: "Tỵ,Hợi",
            gio_tot: "Sửu(1-3), Thìn(7-9), Ngọ(11-13), Mùi(13-15), Tuất(19-21), Hợi(21-23)",
            gio_xau: "Tý(23-1), Dần(3-5), Mão(5-7), Tỵ(9-11), Thân(15-17), Dậu(17-19)"
        },
        {
            chi: "Tý,Ngọ",
            gio_tot: "Tý(23-1), Sửu(1-3), Mão(5-7), Ngọ(11-13), Thân(15-17), Dậu(17-19)",
            gio_xau: "Dần(3-5), Thìn(7-9), Tỵ(9-11), Mùi(13-15), Tuất(19-21), Hợi(21-23)"
        },
        {
            chi: "Sửu,Mùi",
            gio_tot: "Dần(3-5), Mão(5-7), Tỵ(9-11), Thân(15-17), Tuất(19-21), Hợi(21-23)",
            gio_xau: "Tý(23-1), Sửu(1-3), Thìn(7-9), Ngọ(11-13), Mùi(13-15), Dậu(17-19)"
        },
    ];


    public static MONTH_NAMES = ["Tháng một", "Tháng hai", "Tháng ba", "Tháng tư", "Tháng năm", "Tháng sáu", "Tháng bảy", "Tháng tám", "Tháng chín", "Tháng mười", "Tháng mười một", "Tháng mười hai"];
    /**Trả về tên của 1 tháng trong năm. 
    * @argument mm : tháng cần tính, bắt đầu từ 0 (cho tháng 1).
    * 
    * @author dinhanh
    */
    public static _TinhTenCuaThang(mm: number): string {
        let index = Utils.clamp(mm, 0, 11);
        return this.MONTH_NAMES[index];
    }

    public static getDayOfTheWeekName(day: number): string {
        let index = Utils.clamp(day, 0, 6);
        return CalendarUtils.NAME_OF_DAYS[index];
    }

    public static getDayOfTheWeekShortName(day: number): string {
        let index = Utils.clamp(day, 0, 6);
        return CalendarUtils.WEEK_DAYS[index];
    }

    /**Trả về số ngày trong 1 tháng của 1 năm. 
    * @argument mm : tháng cần tính, bắt đầu từ 0 (cho tháng 1).
    * @argument yy : năm cần tính.
    * 
    * @author dinhanh
    */
    public static _TinhSoNgayTrongThang(mm: number, yy: number): number {
        let mIndex = Utils.clamp(mm, 0, 11);
        if (this.isLeap(yy)) {
            return this.day_in_months_nhuan[mIndex];
        }
        return this.day_in_months[mIndex];
    }



    /** Tính ngày Julius (Julius Date) của 1 ngày dương lịch (Gregory Date). 
    * @argument dd : ngày cần tính.
    * @argument mm : tháng cần tính, bắt đầu từ 1
    * @argument yy : năm cần xem.
    * 
    * @author dinhanh
    */
    public static _TinhNgayJulius(dd: number, mm: number, yy: number) {

        let monthDistance: number = Math.floor((14 - mm) / 12);
        let yearJulius: number = yy + 4800 - monthDistance;
        let monthJulius: number = mm + 12 * monthDistance - 3;

        let dayDistance: number = dd + Math.floor((153 * monthJulius + 2) / 5) + 365 * yearJulius + Math.floor(yearJulius / 4);
        let juliusDate: number = dayDistance - Math.floor(yearJulius / 100) + Math.floor(yearJulius / 400) - 32045;

        if (juliusDate < 2299161) {
            juliusDate = dayDistance - 32083;
        }

        return juliusDate;
    }

    /** Tính ngày dương lịch từ số ngày Julius
    * @argument juliusDate : số ngày julius.
    * 
    * @author dinhanh
    */
    public static _TinhNgayDuongTuNgayJulius(juliusDate: number) {
        var aNumber, bNumber, cNumber, dNumber, eNumber, mNumber;
        var day, month, year;
        if (juliusDate > 2299161) {
            // Gregorian calendar
            aNumber = juliusDate + 32044;
            bNumber = Math.floor((4 * aNumber + 3) / 146097);
            cNumber = aNumber - Math.floor((bNumber * 146097) / 4);
        } else {
            // Julius calendar
            bNumber = 0;
            cNumber = juliusDate + 32082;
        }

        dNumber = Math.floor((4 * cNumber + 3) / 1461);
        eNumber = cNumber - Math.floor((1461 * dNumber) / 4);
        mNumber = Math.floor((5 * eNumber + 2) / 153);
        day = eNumber - Math.floor((153 * mNumber + 2) / 5) + 1;
        month = mNumber + 3 - 12 * Math.floor(mNumber / 10);
        year = bNumber * 100 + dNumber - 4800 + Math.floor(mNumber / 10);
        return new Array(day, month, year);

    }
    /**
     * Tính ngày sóc
     * 
     * Để tính được âm lịch trước hết ta cần xác định các tháng âm lịch bắt đầu vào ngày nào
     * Thuật toán sau tính ngày Sóc thứ k kể từ điểm Sóc ngày 1/1/1900. 
     * Kết quả trả về là số ngày Julius của ngày Sóc cần tìm.
     * 
     * @param k ngày Sóc thứ K
     * @param timeZone : Múi giờ
     * 
     * @author dinhanh
     */
    public static _TinhNgaySoc(k: number, timeZone?: number): number {
        let T, T2, T3, dr, Jd1, M, Mpr, F, C1, deltat, JdNew;
        var GMT: number;

        GMT = this.GMT;
        if (timeZone) {
            GMT = timeZone;
        }

        T = k / 1236.85; // Time in Julian centuries from 1900 January 0.5
        T2 = T * T;
        T3 = T2 * T;
        dr = Math.PI / 180;
        Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
        Jd1 = Jd1 + 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr); // Mean new moon
        M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3; // Sun's mean anomaly
        Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3; // Moon's mean anomaly
        F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3; // Moon's argument of latitude
        C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
        C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
        C1 = C1 - 0.0004 * Math.sin(dr * 3 * Mpr);
        C1 = C1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
        C1 = C1 - 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
        C1 = C1 - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
        C1 = C1 + 0.0010 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));
        if (T < -11) {
            deltat = 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3;
        } else {
            deltat = -0.000278 + 0.000265 * T + 0.000262 * T2;
        };
        JdNew = Jd1 + C1 - deltat;
        return Math.floor((JdNew + 0.5 + GMT / 24));
    }

    /**
     * Tính tọa độ mặt trời
     * 
     * Để biết Trung khí nào nằm trong tháng âm lịch nào, ta chỉ cần tính xem mặt trời nằm ở khoảng nào trên đường hoàng đạo vào thời điểm bắt đầu một tháng âm lịch. 
     * Ta chia đường hoàng đạo làm 12 phần và đánh số các cung này từ 0 đến 11: từ Xuân phân đến Cốc vũ là 0; từ Cốc vũ đến Tiểu mãn là 1; từ Tiểu mãn đến Hạ chí là 2; v.v.. 
     * 
     * Với hàm này ta biết được một tháng âm lịch chứa Trung khí nào. Giả sử một tháng âm lịch bắt đầu vào ngày N1 và tháng sau đó bắt đầu vào ngày N2 và hàm getSunLongitude cho kết quả là 8 với N1 và 9 với N2. Như vậy tháng âm lịch bắt đầu ngày N1 là tháng chứa Đông chí: trong khoảng từ N1 đến N2 có một ngày mặt trời di chuyển từ cung 8 (sau Tiểu tuyết) sang cung 9 (sau Đông chí). Nếu hàm getSunLongitude trả lại cùng một kết quả cho cả ngày bắt đầu một tháng âm lịch và ngày bắt đầu tháng sau đó thì tháng đó không có Trung khí và như vậy có thể là tháng nhuận.
     * 
     * @param jdn số ngày Julius của ngày cần tính
     * @param timeZone múi giờ hiện tại
     * 
     * @author dinhanh
     */
    public static _TinhToaDoMatTroi(jdn: number, timeZone?: number): number {
        var GMT: number = this.GMT;
        if (timeZone) {
            GMT = timeZone;
        }

        let T, T2, dr, M, L0, DL, L;
        T = (jdn - 2451545.5 - GMT / 24) / 36525; // Time in Julian centuries from 2000-01-01 12:00:00 GMT
        T2 = T * T;
        dr = Math.PI / 180; // degree to radian
        M = 357.52910 + 35999.05030 * T - 0.0001559 * T2 - 0.00000048 * T * T2; // mean anomaly, degree
        L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2; // mean longitude, degree
        DL = (1.914600 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
        DL = DL + (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.000290 * Math.sin(dr * 3 * M);
        L = L0 + DL; // true longitude, degree
        L = L * dr;
        L = L - Math.PI * 2 * (Math.floor(L / (Math.PI * 2))); // Normalize to (0, 2*PI)
        return Math.floor((L / Math.PI * 6));
    }

    /**
     * Tìm ngày bắt đầu tháng 11 âm lịch
     * 
     * Đông chí thường nằm vào khoảng 19/12-22/12, như vậy trước hết ta tìm ngày Sóc trước ngày 31/12. 
     * Nếu tháng bắt đầu vào ngày đó không chứa Đông chí thì ta phải lùi lại 1 tháng nữa.
     * 
     * @param yy năm cần tính
     * @param timeZone múi giờ
     * @author dinhanh
     */
    public static _NgayBatDauThang11AmLich(yy: number, timeZone?: number): number {

        var GMT: number = this.GMT;
        if (timeZone) {
            GMT = timeZone;
        }

        var k, off, sunLong;
        var nm: number = 0;
        off = CalendarUtils._TinhNgayJulius(31, 12, yy) - 2415021;
        k = Math.floor(off / 29.530588853);
        nm = this._TinhNgaySoc(k, GMT);
        sunLong = CalendarUtils._TinhToaDoMatTroi(nm, GMT); // sun longitude at local midnight
        if (sunLong >= 9) {
            nm = this._TinhNgaySoc(k - 1, GMT);
        }
        return nm;
    }

    /**
     * Xác định tháng nhuận nằm ở vị trí nào sau tháng 11 (a11)
     * 
     * Nếu giữa hai tháng 11 âm lịch (tức tháng có chứa Đông chí) có 13 tháng âm lịch thì năm âm lịch đó có tháng nhuận. 
     * Để xác định tháng nhuận, ta sử dụng hàm getSunLongitude. 
     * 
     * @param a11 ngày bắt đầu tháng 11 âm lịch mà một trong 13 tháng sau đó là tháng nhuận.
     * @param timeZone múi giờ
     * 
     * @author dinhanh
     */
    public static _TinhThangNhuanSauThang11(a11: number, timeZone?: number): number {
        var GMT: number = this.GMT;
        if (timeZone) {
            GMT = timeZone;
        }

        var k, last, arc, i;
        k = Math.floor((a11 - 2415021.076998695) / 29.530588853 + 0.5);
        last = 0;
        i = 1; // We start with the month following lunar month 11
        arc = this._TinhToaDoMatTroi(this._TinhNgaySoc(k + i, GMT), GMT);
        do {
            last = arc;
            i++;
            arc = this._TinhToaDoMatTroi(this._TinhNgaySoc(k + i, GMT), GMT);
        } while (arc != last && i < 14);

        return i - 1;
    }

    /**
     * Đổi ngày dương ra ngày âm
     *  
     * Trước hết ta xem ngày monthStart bắt đầu tháng âm lịch chứa ngày này là ngày nào (dùng hàm getNewMoonDay như trên đã nói). 
     * Sau đó, ta tìm các ngày a11 và b11 là ngày bắt đầu các tháng 11 âm lịch trước và sau ngày đang xem xét. 
     * Nếu hai ngày này cách nhau dưới 365 ngày thì ta chỉ còn cần xem monthStart và a11 cách nhau bao nhiêu tháng là có thể tính được dd/mm/yy nằm trong tháng mấy âm lịch. 
     * Ngược lại, nếu a11 và b11 cách nhau khoảng 13 tháng âm lịch thì ta phải tìm xem tháng nào là tháng nhuận và từ đó suy ra ngày đang tìm nằm trong tháng nào.
     * 
     * @param dd ngày cần đổi
     * @param mm tháng cần đổi (bắt đầu từ 1)
     * @param yy năm cần đổi
     * @param timeZone múi giờ
     */
    public static _TinhNgayAm(dd: number, mm: number, yy: number, timeZone?: number) {
        var GMT: number = this.GMT;
        if (timeZone) {
            GMT = timeZone;
        }

        let k, dayNumber, monthStart, a11, b11, lunarDay, lunarMonth, lunarYear, lunarLeap;
        dayNumber = this._TinhNgayJulius(dd, mm, yy);
        k = Math.floor(((dayNumber - 2415021.076998695) / 29.530588853));
        monthStart = this._TinhNgaySoc(k + 1, GMT);
        if (monthStart > dayNumber) {
            monthStart = this._TinhNgaySoc(k, GMT);
        }
        a11 = this._NgayBatDauThang11AmLich(yy, GMT);
        b11 = a11;
        if (a11 >= monthStart) {
            lunarYear = yy;
            a11 = this._NgayBatDauThang11AmLich(yy - 1, GMT);
        } else {
            lunarYear = yy + 1;
            b11 = this._NgayBatDauThang11AmLich(yy + 1, GMT);
        }
        lunarDay = dayNumber - monthStart + 1;
        let diff = Math.floor(((monthStart - a11) / 29));
        lunarLeap = 0;
        lunarMonth = diff + 11;
        if (b11 - a11 > 365) {
            let leapMonthDiff = this._TinhThangNhuanSauThang11(a11, GMT);
            if (diff >= leapMonthDiff) {
                lunarMonth = diff + 10;
                if (diff == leapMonthDiff) {
                    lunarLeap = 1;
                }
            }
        }
        if (lunarMonth > 12) {
            lunarMonth = lunarMonth - 12;
        }
        if (lunarMonth >= 11 && diff < 4) {
            lunarYear -= 1;
        }


        return new Array(lunarDay, lunarMonth, lunarYear);
    }

    /**
     * Đổi âm lịch ra dương lịch
     * @param lunarDay ngày âm lịch
     * @param lunarMonth tháng âm lịch
     * @param lunarYear năm âm lịch
     * @param timeZone múi giờ
     * 
     * @author dinhanh
     */
    public static _TinhNgayDuong(lunarDay: any, lunarMonth: any, lunarYear: any, timeZone?: number) {
        var GMT: number = this.GMT;
        if (timeZone) {
            GMT = timeZone;
        }
        let k, a11, b11, off, leapOff, leapMonth, monthStart;
        if (lunarMonth < 11) {
            a11 = this._NgayBatDauThang11AmLich(lunarYear - 1, GMT);
            b11 = this._NgayBatDauThang11AmLich(lunarYear, GMT);
        } else {
            a11 = this._NgayBatDauThang11AmLich(lunarYear, GMT);
            b11 = this._NgayBatDauThang11AmLich(lunarYear + 1, GMT);
        }
        off = lunarMonth - 11;
        if (off < 0) {
            off += 12;
        }
        if (b11 - a11 > 365) {
            leapOff = this._TinhThangNhuanSauThang11(a11, GMT);
            leapMonth = leapOff - 2;
            if (leapMonth < 0) {
                leapMonth += 12;
            }
            if (off >= leapOff) {
                off += 1;
            }
        }
        k = Math.floor((0.5 + (a11 - 2415021.076998695) / 29.530588853));
        monthStart = this._TinhNgaySoc(k + off, GMT);
        return this._TinhNgayDuongTuNgayJulius(monthStart + lunarDay - 1);
    }


    /** Trả về số ngày đã qua trong năm ở tháng mm. 
    * @argument mm : tháng cần xem, bắt đầu từ 0 (cho tháng 1).
    * @argument yy : năm cần xem.
    * 
    * @author dinhanh
    */
    public static getDaysPassInYear(mm: number, yy: number): number {
        var sum = 0;
        if (mm == 1) {
            return 0;
        }
        if (yy % 4 == 0) {
            for (let i = 0; i < mm - 1; i++) {
                sum += this.day_in_months_nhuan[i];
            }
        } else {
            for (let i = 0; i < mm - 1; i++) {
                sum += this.day_in_months[i];
            }
        }
        return sum;
    }

    /**
     * Tính Can Chi Theo Năm (đầu vào theo dương lịch)
     * @param dd ngày muốn xem
     * @param mm tháng muốn xem
     * @param yy năm muốn xem
     */
    public static _TinhCanChiTheoNam(dd: number, mm: number, yy: number) {
        let x: number[] = this._TinhNgayAm(dd, mm, yy);
        let canIndex: number = Math.floor(((x[2] + 6) % 10));
        let chiIndex: number = Math.floor(((x[2] + 8) % 12));
        return CalendarUtils._CAN[canIndex] + " " + CalendarUtils._CHI[chiIndex];
    }

    //tính can chi theo tháng (đầu vào theo dương lịch)
    public static _TinhCanChiTheoThang(dd: any, mm: any, yy: any): string {
        let result: string;
        let chi: string;
        let y: number[] = this._TinhNgayAm(dd, mm, yy);
        let month: number = y[1];
        if (month == 1) {
            chi = "Dần"
        }
        if (month == 2) {
            chi = "Mão"
        }
        if (month == 3) {
            chi = "Thìn"
        }
        if (month == 4) {
            chi = "Tỵ"
        }
        if (month == 5) {
            chi = "Ngọ"
        }
        if (month == 6) {
            chi = "Mùi"
        }
        if (month == 7) {
            chi = "Thân"
        }
        if (month == 8) {
            chi = "Dậu"
        }
        if (month == 9) {
            chi = "Tuất"
        }
        if (month == 10) {
            chi = "Hợi"
        }
        if (month == 11) {
            chi = "Tý"
        }
        if (month == 12) {
            chi = "Sửu"
        }

        let z: number[] = this._TinhNgayAm(dd, mm, yy);
        let x: number = (z[2] * 12 + z[1] + 3) % 10;
        let can: string;
        if (x == 0) {
            can = "Giáp"
        }
        if (x == 1) {
            can = "Ất"
        }
        if (x == 2) {
            can = "Bính"
        }
        if (x == 3) {
            can = "Đinh"
        }
        if (x == 4) {
            can = "Mậu"
        }
        if (x == 5) {
            can = "Kỷ"
        }
        if (x == 6) {
            can = "Canh"
        }
        if (x == 7) {
            can = "Tân"
        }
        if (x == 8) {
            can = "Nhâm"
        }
        if (x == 9) {
            can = "Quý"
        }
        result = can + " " + chi;
        return result;
    }

    //Tính Can Chi theo Ngày (đầu vào theo dương lịch)
    public static _TinhCanChiTheoNgay(date: number, month: number, year: number): string {
        let can: string;
        let chi: string;
        let result: string;
        let N: number = Math.floor(this._TinhNgayJulius(date, month, year));

        if (Math.floor(((N + 9) % 10)) == 0) {
            can = "Giáp"
        }
        if (Math.floor(((N + 9) % 10)) == 1) {
            can = "Ất"
        }
        if (Math.floor(((N + 9) % 10)) == 2) {
            can = "Bính"
        }
        if (Math.floor(((N + 9) % 10)) == 3) {
            can = "Đinh"
        }
        if (Math.floor(((N + 9) % 10)) == 4) {
            can = "Mậu"
        }
        if (Math.floor(((N + 9) % 10)) == 5) {
            can = "Kỷ"
        }
        if (Math.floor(((N + 9) % 10)) == 6) {
            can = "Canh"
        }
        if (Math.floor(((N + 9) % 10)) == 7) {
            can = "Tân"
        }
        if (Math.floor(((N + 9) % 10)) == 8) {
            can = "Nhâm"
        }
        if (Math.floor(((N + 9) % 10)) == 9) {
            can = "Quý"
        }
        if (Math.floor(((N + 1) % 12)) == 0) {
            chi = "Tý"
        }
        if (Math.floor(((N + 1) % 12)) == 1) {
            chi = "Sửu"
        }
        if (Math.floor(((N + 1) % 12)) == 2) {
            chi = "Dần"
        }
        if (Math.floor(((N + 1) % 12)) == 3) {
            chi = "Mão"
        }
        if (Math.floor(((N + 1) % 12)) == 4) {
            chi = "Thìn"
        }
        if (Math.floor(((N + 1) % 12)) == 5) {
            chi = "Tỵ"
        }
        if (Math.floor(((N + 1) % 12)) == 6) {
            chi = "Ngọ"
        }
        if (Math.floor(((N + 1) % 12)) == 7) {
            chi = "Mùi"
        }
        if (Math.floor(((N + 1) % 12)) == 8) {
            chi = "Thân"
        }
        if (Math.floor(((N + 1) % 12)) == 9) {
            chi = "Dậu"
        }
        if (Math.floor(((N + 1) % 12)) == 10) {
            chi = "Tuất"
        }
        if (Math.floor(((N + 1) % 12)) == 11) {
            chi = "Hợi"
        }
        result = can + " " + chi;
        return result;
    }

    //Tính ngày hoàng đạo, hắc đạo
    public static getZodiacDay(date: number, month: number, year: number): number {
        let lunarmonth: number = this._TinhNgayAm(date, month, year)[1];
        let temp: string = this._TinhCanChiTheoNgay(date, month, year);
        let can = temp.split(" ")[0];
        let chi = temp.split(" ")[1];
        if (lunarmonth == 1 || lunarmonth == 7) {
            if (chi == "Tý" || chi == "Sửu" || chi == "Tỵ" || chi == "Mùi") {
                return 1;
            } else if (chi == "Ngọ" || chi == "Mão" || chi == "Hợi" || chi == "Dậu") {
                return 2;
            } else {
                return 0;
            }
        }

        if (lunarmonth == 2 || lunarmonth == 8) {
            if (chi == "Dần" || chi == "Mão" || chi == "Mùi" || chi == "Dậu") {
                return 1;
            } else if (chi == "Thân" || chi == "Tỵ" || chi == "Hợi" || chi == "Sửu") {
                return 2;
            } else {
                return 0;
            }
        }

        if (lunarmonth == 3 || lunarmonth == 9) {
            if (chi == "Thìn" || chi == "Tỵ" || chi == "Dậu" || chi == "Hợi") {
                return 1;
            } else if (chi == "Tuất" || chi == "Mùi" || chi == "Mão" || chi == "Sửu") {
                return 2;
            } else {
                return 0;
            }
        }

        if (lunarmonth == 4 || lunarmonth == 10) {
            if (chi == "Ngọ" || chi == "Sửu" || chi == "Hợi" || chi == "Mùi") {
                return 1;
            } else if (chi == "Tý" || chi == "Dậu" || chi == "Tỵ" || chi == "Mão") {
                return 2;
            } else {
                return 0;
            }
        }

        if (lunarmonth == 5 || lunarmonth == 11) {
            if (chi == "Thân" || chi == "Sửu" || chi == "Dậu" || chi == "Mão") {
                return 1;
            } else if (chi == "Dần" || chi == "Mùi" || chi == "Hợi" || chi == "Tỵ") {
                return 2;
            } else {
                return 0;
            }
        }

        if (lunarmonth == 6 || lunarmonth == 12) {
            if (chi == "Tuất" || chi == "Hợi" || chi == "Tỵ" || chi == "Mão") {
                return 1;
            } else if (chi == "Thìn" || chi == "Sửu" || chi == "Mùi" || chi == "Dậu") {
                return 2;
            } else {
                return 0;
            }
        }
    }
    //tính can của ngày
    public static getCanDay(date: number, month: number, year: number): string {
        let result: string;
        let N: number = Math.floor(this._TinhNgayJulius(date, month, year));
        let tempCalculation: number = Math.floor(((N + 9) % 10));
        switch (tempCalculation) {
            case 0:
                result = "Giáp";
                break;
            case 1:
                result = "Ất";
                break;
            case 2:
                result = "Bính";
                break;
            case 3:
                result = "Đinh";
                break;
            case 4:
                result = "Mậu";
                break;
            case 5:
                result = "Kỷ";
                break;
            case 6:
                result = "Canh";
                break;
            case 7:
                result = "Nhâm";
                break;
            case 8:
                result = "Tân";
                break;
            case 9:
                result = "Quý";
                break;
            default:
                break;
        }
        return result;
    }

    //quy đổi giờ sang 12 canh
    public static exchangetoZodiacTime(hour: number): string {
        let result: string;
        if (hour >= 1 && hour < 3) {
            result = "Sửu"
        } else if (hour >= 3 && hour < 5) {
            result = "Dần"
        } else if (hour >= 5 && hour < 7) {
            result = "Mão"
        } else if (hour >= 7 && hour < 9) {
            result = "Thìn"
        } else if (hour >= 9 && hour < 11) {
            result = "Tỵ"
        } else if (hour >= 11 && hour < 13) {
            result = "Ngọ"
        } else if (hour >= 13 && hour < 15) {
            result = "Mùi"
        } else if (hour >= 15 && hour < 17) {
            result = "Thân"
        } else if (hour >= 17 && hour < 19) {
            result = "Dậu"
        } else if (hour >= 19 && hour < 21) {
            result = "Tuất"
        } else if (hour >= 21 && hour < 23) {
            result = "Hợi"
        } else if (hour >= 23 && hour <= 24) {
            result = "Tý"
        } else if (hour >= 0 && hour < 1) {
            result = "Tý"
        }
        return result;
    }

    //lấy dữ liệu từ bảng dữ liệu can của giờ
    public static getDataFromZodiacTime(can: String, canh: String): string {
        let result: string;
        for (let x of CalendarUtils.ZODIACTIME) {
            for (let y of x.can) {
                if (can == y) {
                    if (canh == "Tý") {
                        result = x.ti;
                    } else if (canh == "Sửu") {
                        result = x.suu;
                    } else if (canh == "Dần") {
                        result = x.dan;
                    } else if (canh == "Mão") {
                        result = x.mao;
                    } else if (canh == "Thìn") {
                        result = x.thin;
                    } else if (canh == "Tỵ") {
                        result = x.ty;
                    } else if (canh == "Ngọ") {
                        result = x.ngo;
                    } else if (canh == "Mùi") {
                        result = x.mui;
                    } else if (canh == "Thân") {
                        result = x.than;
                    } else if (canh == "Dậu") {
                        result = x.dau;
                    } else if (canh == "Tuất") {
                        result = x.tuat;
                    } else if (canh == "Hợi") {
                        result = x.hoi;
                    }
                }
            }
        }
        return result;
    }

    //tính can chi cho giờ 
    public static _TinhCanChiTheoGio(dd: any, mm: any, yy: any, hour: number): string {
        let result: string;
        let can: string = this.getCanDay(dd, mm, yy);
        let canh: string = this.exchangetoZodiacTime(hour);
        result = this.getDataFromZodiacTime(can, canh);
        return result;
    }

    //Tính năm nhuận. Trả về số ngày nhuận
    public static isLeap(year): number {
        if ((year % 4) || ((year % 100 === 0) && (year % 400))) return 0;
        else return 1;
    }

    //Tính số ngày của một tháng
    public static daysInMonth(month, year) {
        return (month === 2) ? (28 + this.isLeap(year)) : 31 - (month - 1) % 7 % 2;
    }
    public static getTrucDay(lunarMonth: number, chi: string, data: any) {
        for (let i = (lunarMonth - 1) * 12; i < (lunarMonth - 1) * 12 + 12; i++) {
            if (chi == data[i].ngay_chi) {
                return data[i].name;
            }
        }
    }
    public static getTietDay(date: number, solarMonth: number, data: any) {

        let dateNumber = [];
        for (let j = ((solarMonth - 1) * 2); j < ((solarMonth - 1) * 2) + 2; j++) {
            dateNumber.push(parseInt(data[j].date));
        }
        if (date < dateNumber[0] && solarMonth == 1) {
            return data[data.length - 1].name;
        }
        if (date < dateNumber[0]) {
            return data[(solarMonth - 1) * 2 - 1].name;
        } else if (date >= dateNumber[0] && date < dateNumber[1]) {
            return data[(solarMonth - 1) * 2].name;
        } else if (date >= dateNumber[1]) {
            return data[(solarMonth - 1) * 2 + 1].name;
        }
    }

    public static getHoursBetterAndBad(chi: string) {
        let result = [[], []];

        let check: boolean = false;
        for (let k = 0; k < this.HOURS.length; k++) {
            let chi_array = this.HOURS[k].chi.split(",");
            chi_array.forEach(element => {
                if (chi.toLowerCase() == element.toLowerCase()) {
                    result[0].push(this.HOURS[k].gio_tot);
                    result[1].push(this.HOURS[k].gio_xau);
                    check = true;
                }
            });
            if (check) {
                break;
            }
        }
        return result;
    }
    public static getTaiThanHyThan(canchi: string, data: any) {
        let can = canchi.split(" ")[0];
        let chi = canchi.split(" ")[1];
        let taiThan_hyThan_data = data.taithan_hythan;
        let hac_than_data = data.hac_than;
        let result = [];
        for (let i = 0; i < taiThan_hyThan_data.length; i++) {
            if (can == taiThan_hyThan_data[i].can) {
                let huong_xuat_hanh = {
                    huong_id: taiThan_hyThan_data[i].huong_id,
                    huong_name: taiThan_hyThan_data[i].taithan_hythan
                }
                result.push(huong_xuat_hanh);
            }
        }
        for (let j = 0; j < hac_than_data.length; j++) {
            if (can == hac_than_data[j].can && chi == hac_than_data[j].chi) {
                let huong_xuat_hanh = {
                    huong_id: hac_than_data[j].huong_id,
                    huong_name: "Hắc Thần"
                }
                result.push(huong_xuat_hanh);
                break;
            }
        }
        return result;
    }
    public static getTuoiXungKhac(canchi: string, data: any) {

        let tuoi_xung_khac_data = data.tuoi_xung_khac;
        for (let t = 0; t < tuoi_xung_khac_data.length; t++) {
            if (canchi.toLowerCase() == tuoi_xung_khac_data[t].canchi.toLowerCase()) {
                return tuoi_xung_khac_data[t].tuoi_xung_khac;
            }
        }
    }

    public static getSaoTot(chi: string, lunarMonth: number, data: any) {
        let result = [];
        let data_sao_tot = data.sao_tot;
        for (let i = 0; i < data_sao_tot.length; i++) {
            if (chi.toLowerCase() == data_sao_tot[i].chi.split(", ")[lunarMonth - 1].toLowerCase()) {
                result.push(data_sao_tot[i].name);
            }
        }
        return result;
    }
    public static getSaoXau(can: string, chi: string, lunarMonth: number, data: any) {
        let result = [];
        let data_sao_xau = data.sao_xau;
        for (let i = 0; i < data_sao_xau.length; i++) {
            if (i < data_sao_xau.length - 2 && chi.toLowerCase() == data_sao_xau[i].chi.split(", ")[lunarMonth - 1].toLowerCase()) {
                result.push(data_sao_xau[i].name);
            }
            if (i >= data_sao_xau.length - 2 && can.toLowerCase() == data_sao_xau[i].chi.split(", ")[lunarMonth - 1].toLowerCase()) {
                result.push(data_sao_xau[i].name);
            }
        }
        return result;
    }
    public static GetTNBINFO(dd: number, mm: number, yy: number, data) {
        let detailData = data.DayDetail;
        var idNUmber = this.getIDStar(dd, mm, yy);
        let tnb_info = {
            thapnhibat_ten: data[idNUmber - 1].thapnhibat_ten,
            nguhanh_id: data[idNUmber - 1].nguhanh_id,
            thapnhibat_tho: data[idNUmber - 1].thapnhibat_tho,
            nen_lam: data[idNUmber - 1].nen_lam,
            kieng_ky: data[idNUmber - 1].kieng_ky
        }
        return tnb_info;
    }
    public static getIDStar(dd: number, mm: number, yy: number) {
        // moc la ngay 1-1-1900 id sao la 5 ;
        var number1 = (yy - 1900) + Math.floor((yy - 1900) / 4);
        let number2 = dd;
        for (let i = 0; i < mm - 1; i++) {
            number2 += this.day_in_months[i];
        }
        let number = 0;

        if (mm < 2 && yy % 4 == 0) {
            number = number1 + number2 - 1;
        }
        if (yy % 4 != 0) {
            number = number1 + number2;
        }

        let number_day_more = 0;
        number_day_more = (number % 28);

        if (number_day_more <= 23) {
            return number_day_more + 4;
        } else {
            return (5 + number_day_more) % 28;
        }

    }


}