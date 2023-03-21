function isPalindrome(s: string): boolean {
  let i = 0;
  let j = s.length - 1;
  while (i < j) {
    if (s[i] !== s[j]) {
      return false;
    }
    i++;
    j--;
  }
  return true;
}

function solution(s: string): string {
  while (s.length > 1) {
    let longestPalindrome = "";
    for (let i = 0; i < s.length; i++) {
      const prefix = s.substring(0, i + 1);
      if (isPalindrome(prefix) && prefix.length > longestPalindrome.length) {
        longestPalindrome = prefix;
      }
    }
    if (longestPalindrome.length > 1) {
      s = s.substring(longestPalindrome.length);
    } else {
      break;
    }
  }
  return s;
}
