import mongoSanitize from 'express-mongo-sanitize';
const { sanitize } = mongoSanitize;

const obj = { '$gt': '' };
mongoSanitize.sanitize(obj);
console.log('Sanitized:', obj);
if (Object.keys(obj).length === 0) {
  console.log('Success: Object was modified in-place');
} else {
  console.log('Failure: Object was NOT modified in-place');
}
