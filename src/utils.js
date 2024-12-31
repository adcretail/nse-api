const moment = require('moment');
const { extendMoment } = require('moment-range');

const momentRange = extendMoment(moment);

/**
 * Divide a date range into chunks of a specified number of days.
 * 
 * @param {Date} startDate Start date of the range.
 * @param {Date} endDate End date of the range.
 * @param {number} chunkInDays Number of days per chunk.
 * @returns {{ start: string, end: string }[]} Array of date range chunks.
 */
const getDateRangeChunks = (startDate, endDate, chunkInDays) => {
  // Validate input dates
  if (!(startDate instanceof Date) || isNaN(startDate.getTime()) ||
      !(endDate instanceof Date) || isNaN(endDate.getTime())) {
    throw new Error('Invalid date input');
  }

  // Check if start date is before end date
  if (startDate > endDate) {
    throw new Error('Start date cannot be after end date');
  }

  // Validate chunk size
  if (typeof chunkInDays !== 'number' || chunkInDays <= 0 || chunkInDays % 1 !== 0) {
    throw new Error('Chunk size must be a positive integer');
  }

  // Create the date range and iterate in chunks
  const range = momentRange.range(startDate, endDate);
  const dateRanges = [];
  let currentStart = moment(range.start);

  while (currentStart.isBefore(range.end)) {
    const currentEnd = moment.min(
      currentStart.clone().add(chunkInDays - 1, 'days'),
      range.end
    );

    dateRanges.push({
      start: currentStart.format('YYYY-MM-DD'),
      end: currentEnd.format('YYYY-MM-DD'),
    });

    // Move to the next chunk
    currentStart = currentEnd.clone().add(1, 'day');
  }

  return dateRanges;
};

/**
 * Pause execution for a specified number of milliseconds.
 * 
 * @param {number} ms Number of milliseconds to sleep.
 * @returns {Promise<void>} Promise resolving after the sleep period.
 */
const sleep = async (ms) => {
  // Validate input milliseconds
  if (typeof ms !== 'number' || ms < 0) {
    throw new Error('Sleep time must be a non-negative number');
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

module.exports = {
  getDateRangeChunks,
  sleep,
};
