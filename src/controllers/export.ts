const excel = require("node-excel-export");

const styles = {
  headerDark: {
    fill: {
      fgColor: {
        rgb: "FF000000"
      }
    },
    font: {
      color: {
        rgb: "FFFFFFFF"
      },
      sz: 14,
      bold: true,
      underline: true
    }
  },
  cellPink: {
    fill: {
      fgColor: {
        rgb: "FFFFCCFF"
      }
    }
  },
  cellGreen: {
    fill: {
      fgColor: {
        rgb: "FF00FF00"
      }
    }
  }
};

const heading = [
  ["#", "Họ và tên", "MSSV", "Khoa", "Email", "Số điện thoại", "Số ngày", "Ghi chú"] // <-- It can be only values
];

const specification = {
  id: { // <- the key should match the actual data key
    width: 100
  },
  fullName: {
    displayName: "Họ và tên",
    width: 300
  },
  code: {
    displayName: "MSSV",
    width: 100
  },
  faculty: {
    displayName: "Khoa",
    width: 500
  },
  email: {
    displayName: "Email",
    width: 200
  },
  phone: {
    displayName: "Số điện thoại",
    width: 200
  },
  socialDay: {
    displayName: "Số ngày",
    width: 100,
    cellStyle: function(value: number, row: any) { // <- Renderer function, you can access also any row.property
      return (value > 0) ? {fill: {fgColor: {rgb: "FFFFFFFF"}}} : {fill: {fgColor: {rgb: "FFFF0000"}}}; // <- Inline cell style is possible
    },
  },
  note: {
    width: 500,
    displayName: "Ghi chú",
  }
};

export const buildReport = (dataset: ExportFile[]) => {
  const report = excel.buildExport(
    [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
      {
        heading: heading,
        specification: specification, // <- Report specification
        data: dataset // <-- Report data
      }
    ]
  );
  return report;
};

export interface ExportFile {
  id: number;
  fullName: string;
  code: string;
  faculty: string;
  email: string;
  phone: string;
  socialDay: number;
  note: string;
}

