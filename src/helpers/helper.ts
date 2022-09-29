export const generateRandomString = () => {
	const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	const length = 16;
	const ret = Array.from(crypto.getRandomValues(new Uint32Array(length))) // 32bit 符号なし整数の要素を16個ランダムにとる配列を作る
		.map(n => chars[n % chars.length]) // 乱数配列を順番に処理し、char配列のいずれかの文字を取り出した配列を生成
		.join(''); // 配列を文字列に結合する
	return ret;
}
