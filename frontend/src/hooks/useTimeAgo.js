const useTimeAgo = (timestamp) => {
  const now = new Date();
  const past = new Date(timestamp);

  const diffMs = now - past;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) {
    return "vừa xong";
  }

  if (diffMin < 60) {
    return `${diffMin} phút trước`;
  }

  if (diffHour < 24) {
    return `${diffHour} giờ trước`;
  }

  if (diffDay < 30) {
    return `${diffDay} ngày trước`;
  }

  const diffMonth = Math.floor(diffDay / 30);
  if (diffMonth < 12) {
    return `${diffMonth} tháng trước`;
  }

  const diffYear = Math.floor(diffMonth / 12);
  return `${diffYear} năm trước`;
}

export default useTimeAgo;