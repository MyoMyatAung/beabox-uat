import * as SparkMD5 from 'spark-md5';
const HASH_CHUNK_SIZE = 64 * 1024;

/**
 * Compute fast file hash using head/middle/tail chunks
 * This algorithm reads 64KB from beginning, middle, and end of file
 * then calculates MD5 of the combined data
 * 
 * @param file - File to hash
 * @returns Promise<string> - MD5 hash hex string
 */
export async function computeFileHash(file: File): Promise<string> {
    const fileSize = file.size;

    if (fileSize === 0) {
        throw new Error('File is empty');
    }

    const spark = new SparkMD5.ArrayBuffer();

    // Small file: read entire file
    if (fileSize < HASH_CHUNK_SIZE * 3) {
        const buffer = await file.arrayBuffer();
        spark.append(buffer);
        return spark.end();
    }

    // Large file: read head + middle + tail chunks

    // Head chunk (first 64KB)
    const headBlob = file.slice(0, HASH_CHUNK_SIZE);
    const headBuffer = await headBlob.arrayBuffer();
    spark.append(headBuffer);

    // Middle chunk (64KB from center)
    const middleStart = Math.floor((fileSize - HASH_CHUNK_SIZE) / 2);
    const middleBlob = file.slice(middleStart, middleStart + HASH_CHUNK_SIZE);
    const middleBuffer = await middleBlob.arrayBuffer();
    spark.append(middleBuffer);

    // Tail chunk (last 64KB)
    const tailStart = fileSize - HASH_CHUNK_SIZE;
    const tailBlob = file.slice(tailStart, fileSize);
    const tailBuffer = await tailBlob.arrayBuffer();
    spark.append(tailBuffer);

    const hash = spark.end();
    console.log(`Computed file hash: ${file.name}, size=${(fileSize / 1024 / 1024).toFixed(2)}MB, hash=${hash}`);

    return hash;
}