const filterArticlesByStatus = (status) => {
  return mockArticles.filter((article) => article.status === status);
};

// Mock data for testing
const mockArticles = [
  { id: 1, title: 'Article 1', status: 'approved' },
  { id: 2, title: 'Article 2', status: 'rejected' },
  { id: 3, title: 'Article 3', status: 'pending' },
  { id: 4, title: 'Article 4', status: 'approved' },
  { id: 5, title: 'Article 5', status: 'rejected' },
];

describe('filterArticlesByStatus', () => {
  it('should return only approved articles', () => {
    const result = filterArticlesByStatus('approved');
    expect(result).toEqual([
      { id: 1, title: 'Article 1', status: 'approved' },
      { id: 4, title: 'Article 4', status: 'approved' },
    ]);
    expect(result).toHaveLength(2);
  });

  it('should return only rejected articles', () => {
    const result = filterArticlesByStatus('rejected');
    expect(result).toEqual([
      { id: 2, title: 'Article 2', status: 'rejected' },
      { id: 5, title: 'Article 5', status: 'rejected' },
    ]);
    expect(result).toHaveLength(2);
  });

  it('should return only pending articles', () => {
    const result = filterArticlesByStatus('pending');
    expect(result).toEqual([
      { id: 3, title: 'Article 3', status: 'pending' },
    ]);
    expect(result).toHaveLength(1);
  });

  it('should return an empty array when no articles match the status', () => {
    const result = filterArticlesByStatus('archived');
    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });
});
