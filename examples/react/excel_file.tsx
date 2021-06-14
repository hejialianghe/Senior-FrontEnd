import React from 'react';
import { Input } from 'antd';
import XLSX from 'xlsx';

export interface ExcelFileProps {}

const ExcelFile: React.FC<ExcelFileProps> = () => {
  function onChange(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
		const rABS = !!reader.readAsBinaryString;
		reader.onload = (e) => {
			/* Parse data */
			const bstr = e.target.result;
			const wb = XLSX.read(bstr, {type:rABS ? 'binary' : 'array'});
			/* Get first worksheet */
			const wsname = wb.SheetNames[0];
			const ws = wb.Sheets[wsname];
			/* Convert array of arrays */
			const data = XLSX.utils.sheet_to_json(ws, {header:1});
      console.log('data',data)
			/* Update state */
			// setData(data);
			// setCols(make_cols(ws['!ref']))
		};
		if(rABS) reader.readAsBinaryString(file); else reader.readAsArrayBuffer(file);
  }
  return (
    <div>
      <Input type="file" onChange={onChange}></Input>
    </div>
  );
};

export default ExcelFile;
