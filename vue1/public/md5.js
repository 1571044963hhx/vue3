importScripts('./spark-md5.js');

self.addEventListener('message', (e) => {
    const file = e.data;
    const hash = new SparkMD5.ArrayBuffer();
    const fileReader = new FileReader();

    fileReader.onload = (event) => {
        hash.append(event.target.result);
        const fileMd5 = hash.end();
        self.postMessage(fileMd5); // 将计算得到的 MD5 值发送回主线程
    };

    fileReader.readAsArrayBuffer(file);
});
