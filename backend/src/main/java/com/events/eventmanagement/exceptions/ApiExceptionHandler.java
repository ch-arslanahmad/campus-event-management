package com.events.eventmanagement.exceptions;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.ConstraintViolationException;
import java.util.LinkedHashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

// one error body everywhere: {status, error, message, fields?}
@RestControllerAdvice
public class ApiExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(
        ApiExceptionHandler.class
    );

    public record ApiError(
        int status,
        String error,
        String message,
        @JsonInclude(JsonInclude.Include.NON_EMPTY) Map<String, String> fields
    ) {}

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiError> onResponseStatus(
        ResponseStatusException exception
    ) {
        return build(
            exception.getStatusCode(),
            exception.getReason() == null
                ? "Request failed."
                : exception.getReason(),
            Map.of()
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> onInvalidBody(
        MethodArgumentNotValidException exception
    ) {
        Map<String, String> fields = new LinkedHashMap<>();

        for (FieldError error : exception
            .getBindingResult()
            .getFieldErrors()) {
            fields.putIfAbsent(error.getField(), error.getDefaultMessage());
        }

        return build(HttpStatus.BAD_REQUEST, "Validation failed.", fields);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiError> onConstraintViolation(
        ConstraintViolationException exception
    ) {
        Map<String, String> fields = new LinkedHashMap<>();

        exception
            .getConstraintViolations()
            .forEach(violation ->
                fields.putIfAbsent(
                    violation.getPropertyPath().toString(),
                    violation.getMessage()
                )
            );

        return build(HttpStatus.BAD_REQUEST, "Validation failed.", fields);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiError> onUnreadableBody(
        HttpMessageNotReadableException exception
    ) {
        return build(
            HttpStatus.BAD_REQUEST,
            "Request body is missing or malformed.",
            Map.of()
        );
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiError> onTypeMismatch(
        MethodArgumentTypeMismatchException exception
    ) {
        return build(
            HttpStatus.BAD_REQUEST,
            "Parameter '" + exception.getName() + "' has an invalid value.",
            Map.of()
        );
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ApiError> onUnknownPath(
        NoResourceFoundException exception
    ) {
        return build(HttpStatus.NOT_FOUND, "Endpoint not found.", Map.of());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> onUnexpected(Exception exception) {
        // framework exceptions carry their own status; everything else is 500
        HttpStatusCode status = exception instanceof ErrorResponse response
            ? response.getStatusCode()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        if (status.is5xxServerError()) {
            log.error("Unhandled exception", exception);
        }

        return build(
            status,
            status.is5xxServerError()
                ? "Unexpected server error."
                : "Request failed.",
            Map.of()
        );
    }

    private ResponseEntity<ApiError> build(
        HttpStatusCode code,
        String message,
        Map<String, String> fields
    ) {
        HttpStatus resolved = HttpStatus.resolve(code.value());

        return ResponseEntity.status(code).body(
            new ApiError(
                code.value(),
                resolved == null ? "Error" : resolved.getReasonPhrase(),
                message,
                fields
            )
        );
    }
}
