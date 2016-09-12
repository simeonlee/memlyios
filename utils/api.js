// import request from 'superagent';
// import { NativeModules } from 'react-native';

// var api = (method, URL) => {
//   var r = request(method, apiURL);
//   return r;
// }

// api.uploadPhoto = (fileName, fileUri, uri, callback) => {
//   var upload = {
//     fileName: fileName,
//     uri: fileUri, // either an 'assets-library' url (for files from photo library) or an image dataURL
//     uploadUrl: uri, // your backend url here,
//     mimeType: 'image/jpeg',
//     headers: {},
//     data: {}
//   };

//   NativeModules.FileTransfer.upload(upload, (err, res) => {
//     console.log(err, res);
//     if (err || res.status !== 200) {
//       return callback(err || res.data || 'UNKNOWN NETWORK ERROR');
//     }

//     callback();
//   });
// };

// export default api;