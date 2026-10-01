export class ApiResponse {
  static success(res, data = null, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static created(res, data = null, message = 'Resource created successfully') {
    return res.status(201).json({
      success: true,
      message,
      data,
    });
  }

  static paginated(res, data, pagination, message = 'Success') {
    return res.status(200).json({
      success: true,
      message,
      data,
      pagination: {
        page: Number(pagination.page),
        limit: Number(pagination.limit),
        total: Number(pagination.total),
        totalPages: Math.ceil(pagination.total / pagination.limit) || 1,
      },
    });
  }

  static noContent(res) {
    return res.status(204).send();
  }
}
