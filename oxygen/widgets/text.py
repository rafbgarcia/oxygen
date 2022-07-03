class Text:
    @staticmethod
    def metadata(**kwargs):
        return kwargs.get("build_info")
