import CryptoJS from "crypto-js";

/**
 * Decrypts AES-256-CBC encrypted data.
 *
 * @param {string} encryptedData - The encrypted data (URL-safe Base64 encoded).
 * @returns {string} - The decrypted plain text.
 */
export function decryptWithAes(encryptedData: string): string {
  try {
    // Decode URL-safe Base64 encoded data
    const decodedData = decodeUrlSafeBase64(encryptedData);

    // Perform AES decryption
    const decrypted = CryptoJS.AES.decrypt(
      decodedData,
      CryptoJS.enc.Utf8.parse(import.meta.env.VITE_AES_KEY),
      {
        iv: CryptoJS.enc.Utf8.parse(import.meta.env.VITE_AES_IV),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    // Convert decrypted data to UTF-8 string
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (err) {
    console.error("Decryption failed:", err?.message);
    throw new Error(`Decryption failed: ${err?.message}`);
  }
}

/**
 * Decodes a URL-safe Base64 encoded string to CryptoJS-compatible format.
 *
 * @param {string} data - The URL-safe Base64 encoded string.
 * @returns {string} - The standard Base64 encoded string.
 */
function decodeUrlSafeBase64(data: string): string {
  const base64Data = data.replace(/-/g, "+").replace(/_/g, "/");
  const padding = (4 - (base64Data.length % 4)) % 4;
  return base64Data + "=".repeat(padding);
}

// // Example encrypted data (URL-safe Base64 encoded from Laravel)
// const encryptedData =
//   "xuT6P5o9V_-un06Ws0bhzOQK1bdQYF3gqsn4yiG3S8C3JhQWcokNlgB58og-kDNet7vVhjEIFQj9c9yn0haKLidMvPbWKGJJCoPPtN-zg9RgBDkggz42uf20Gfug4Ym36e_mXU2L9Qs944-t38KHKKi7QzZAaQvJPvIZQ3x57RCJ3sOj5JFNkpMgPmRMKEu96XHPZ7obF50atM0JLNJT9B65slgwLIZ1qsWsgvy7-NvjzQTnmAvC3AuqiNOA3Hss_Y0v9RN2xePFXwexy5dkTKY9sthhN3qRDG9iJqXzLPka-974VYr-j-k7jUo8T6pFxSq0D7y6GfCsxczALoM8VQlet7G9V1vkub-K9D2Bu5W1146UqX4qBPVkQ61MHtENfukXlhx9qPsS3azLFQm8PlykhXKkjYcJWHwIVrqZz2a2CiaBhH2no37SEzY1EYPXbUU7oj-5gsgxe6kSGTKJ_iqJ4c7mRut5vy3wgB1Gh2O7pOA0-OxQ4O_IwVNXUX4O2QnRPE5PbHQaEE8xOoa6GGo9l3D8KdCkb24tRvQx4IRnCEoyJEU3VT6POgdzNgNX1Cg7co-GUxrQUikxTS0jjtIBhK6VlmenGV-3gn3cqVpVcrw90rS8aEhO2kAqHeYjbEZrXJd4IIDM5vOkA_7ORDKQhzUrO5t_cPbZf6CDW0MiqjOSy1YeT3Oy1t_db7Y6wjG5hLTIYa9FkdUig1HvPQVdJKPQJ8RkH3qPyAlzU0xXoMoF9-LNT32KKvjZbmZHUvKeK8_0YvvSdQv6H1OQHNBPMfyqp_gjNsP_a4alAWXPFHtvUopc8nByjvGf_YD0krFmceBFRWkGRacaxlgDxGaPYGClIhvpe3QXoYAhTpqhxBeMO3SWQqbF7t-r39EAy8bwsFXmON64O0h2KC5CIFas16LqP-AobPMWTS2QepOQqngmLLsYCgbvi7Of10MygQsbdk-IPHXW2JdajVxnbBzjo9LAMJ2nj8PggLktzNisPcKrPgt5mz2Inuv9XTu50W9qJasCnyZvqvAcJsPeiSgFJlSdPHFa6WHXB7e2_UEXylur2l_R6y2IGVGL_KL9bajxVEScEo8aA_Pxq2TG_gbNHGENA44a6O8NST45ZqPbQ2Vo5Zii4kDwoZOeIe7iIIqdJQ8DzHye0ttmrrjLFNbikd5owMCsp1jugRuFQ0vungPTpIaNoDf7frA5ecNWvOZ_80BW1P2vPELbl0cOEyL8fd0rOaiekWnlcYaNjUdmbvOINLcILdeRQkZ7OdiPrg5EKmCWDrl307cEOO2uxdT_tNXoT4t-HJxQnp4EXaHqgSxQQxCjgl7JGgsSHYxFq7R477GtrRgXqLLPX1wjwr4mt6T_DDaXh5Ed6a2egbRdLZd5CMKZTb0WWTLFLBpjy63zGQMwTqg_5Ct-oLYgrN-Z6TOlQCq7auzVxY1Bkqw8krOkWslmfwUZd2pkiOYaQinXXFHVT-b2YIM8MH-7IIclvF7ahsh_jEw4fLtvXALjkdhdzTzYfLbMtRXZLCop-KTDnpIszkofIhMs8ZQrBJicDnl_ZJbuZOKDs5fbcitpwq43oumbbBLdWxe92yUAvv5jkhqZwcBh10c0jPlojMLV4xTmBMkM3H7cJ3f0ad45Mwzi3QGFJvvflDUhWrB0JB4_htgEspq-DO_yDIBNeHa0PH1FzvDrDQFM5eYaZiinIv69bVJ5OZOlDjT4k0_A4N4YEcE-EDysgyb7iWdmYaZlJRnK3z3WwPf_ap9wF554j0eT36NncgeZ8dUczgzrwbuakyxI5hRKA6MXYn5mHVrnXi_kIZMv9X3NJG32oVoChz__jgoqK45TVo0Lc7ffjd9SWDsMxgWtjV_mnTzlkj8j7JzrQXG6Qp3eAFn4y12Llcos8q0jAZpzH8f5MjttPrtzxk6bYsWIxMKNRrZTbWF-r3clu7_zknF2Aie-DEHK3sa6IdefYoYjkLxwr2ft_0uT1vpdw919_jpciIlqNLrnYC-xSzXL5pflGNZIY1a3k9rw_dy0RNCENIhWt-qaz_RLufmPQ44fKYbr8UThnWeknWoP8zsqDeIHkjsbGSPAxKX-kHYRYtcmnx3j_N9VSBzgOjqq8O6ztjg2Cnc0vQohoRSc1QYYsabmmbCR-mUn8dWZ10AXmKibEYRPy3ZK8us4gVR8l8KkUBBl_GFJC4eKo8KvCrAmC6Ws4ierdOqdPKpRINAkbpovsdsjcTkm4kN-eCxJyZ3zoBVNlEK641U6w8_gJ14RuLJIA4GeLbk0aUQjCBKU62cwFTq6UZx72YyHo1QS7Mw7TBKGzG7fQTcpu7EYlEKm0ZlcznEqkARjjsSqk0HqnN5WQCkV3RbdO14mA8gjZeJkLMrmxqITpDvbHBfyRz-1JvYMxSwxTQmthFQIVB7Y6Eb8nq4SB3LfMcob6Tvn2pS6D86QA11jryCG7xUtRz1Vk9RvmZinwTIP__2pzHV4keyEpUBDEosPod2Qvla9_kJQ7OuSCkA2tkqvatc3u1S63kNoJWTnVU1wPFcW9AgPgschJI82dddFSb7J8WhlPb1YqhTH4agzDnflg6gX4yFdg8btadFCvY8bgd_qAUCP8klUzfGWk_oCcLmasUfzA8U2CuJ1A1NZTO4rlOVRnNHS_y14Jzxc_2ESagkfs79H9nfrgk6vNYl4X0BZeD4jf4-kQSg2aj7cwcks14Zw5csYEY4Dd5Kuk2oYckmqLPphxDJcIcitCq03fi_t_qgHlp0oEvbAh4o0Ld2DaG9iyxDOU2ERFrb3XMqHVPflVPd74BYp-Ms25oFLqdK8lsKV19iSYucH6zORvi4D912VFCEFYAinfa-TAsq6-HMA4G7UgOO_IQxZZQA-hLSfpjZjWzEnSeYb97W5_Vfcfe64isELtAd9oN7f0jDvcnGwyYRewZesvkcgeTqKC_0ndb3CgkplRnTQCjsEoN1aDwjy1wPaNF0ExjC2jeyB_u2i7RUcRkERo7ZPLFYK-T2jhriX_L2H4hVsIP3ZkwsCsuIAYD2NAHPRa5sYI7BHxrfnaNqireaI_Q3FBdBWZC4bFU3bKFaEF7YzgGSPnupOjbwqcydHBbNYlXLgnBA6PvtM62pW1IVPFqcl_6PupklyRpE100WdoTGb1PNqYGqYZDit8t2BOWuaywfnSgXeqn3pE5IT2HBWpOIgADjffhxn3yVUxnRuxVNEOmLHfON0Ilk6JP9b0JuJ7eKf0M-8iClLTpB0g60qGjOnGhxjp3IQk6BrtoNGIWMZyTDOoFHmMu20VfHFcnFUQOFKUkhP5wlqB_-0VTrXCbPg5m_fsHBtjl-LPVozkm4KV1wTjE5QOpAd-NhE9NiaqR-2PZHCJCNDN4nl2cRMkx1h_umYzCqyB9vZXjLRFy1aX9sYdLpDuilFBjOFohtW1zHiJbssjM_DCvv1-8GCHeKQlj3J_tRHE233gTCZqIl3gt_VqmKb4wlg9iEa5-1zcMAlkd-0zpEyNUayUYG2YvmU3vNH-pWCk_RuYn0KLmlSUy-iaeXvZhwrmegaLDGyV5oPEUG0mgduyKYBNudpUHdV0rtIj5xAdspqt1Px61b6NvkMZK1zYxsOZQo76NcOpKYO1o2iOPEpFptKqU7xJSWZOfeHxzoJU7dU29xnuOe9NerUtp_GP221X7IxDkQbCuwPr1xkvdM4TiXx1XdbENqr9N5HFfdbOqTx3qnU7nNEgKxM4FMLPHLlX52zI536fy1QG9MMaDMxn6QoT8bNm1M-KfdybjjdwmzbNmmVJRknIG093g_xlzCDTX8QkjFni2Js2_qQFEY42BC9J-PDn5oZ6WG6vek_n0Nl9O-HBvNgh0VaHZsYsncDJJPJAiJUWr7-5EbRvQWFgEAUGNWR0fJAv-X6u1lhSooatVMVzq-8TFc2Xq2fl6Q9jtTKwUvISe9TixJllpY5Bp5Itt9K_3v1zXyJHlDpin35QRvQOYvYY0JkLUnOjslfgMkv8QFUUMgYbKeVKnRGWXJahBLaqNckNIsOo5WV5RJTC5XO6B_2k6tKo6NPRVu5vB73iSAeat1SzoXOnGWTzf7kt-";

// try {
//   // Decrypt the data
//   const decryptedData = decryptWithAes(encryptedData);

//   // Print the decrypted result
//   console.log("Decrypted Data:", decryptedData);
// } catch (err) {
//   console.error("Error during decryption:", err.message);
// }
