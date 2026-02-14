/**
 * Convert a string into a URL-friendly slug
 */

function slugify(text) {
  if (!text) return "";

  return text
    .toString()
    .toLowerCase()
    .trim()
    // Remove special characters
    .replace(/[^a-z0-9\s-]/g, "")
    // Replace multiple spaces or dashes with single space
    .replace(/[\s-]+/g, " ")
    // Replace spaces with hyphen
    .replace(/\s/g, "-");
}

module.exports = slugify;
