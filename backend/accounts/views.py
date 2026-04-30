from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status


class DeleteAccountView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        current_password = request.data.get("current_password")
        if not current_password:
            return Response(
                {"current_password": ["Current password is required."]},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = request.user
        if not user.check_password(current_password):
            return Response(
                {"current_password": ["Current password is incorrect."]},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.delete()
        return Response({"detail": "Account deleted successfully."}, status=status.HTTP_200_OK)
