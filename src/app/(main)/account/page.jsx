"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import {
  Card,
  TextInput,
  Button,
  Group,
  Stack,
  Title,
  Text,
  Alert,
  PasswordInput,
  LoadingOverlay,
} from "@mantine/core";
import {
  IconUser,
  IconMail,
  IconPhone,
  IconLock,
  IconCheck,
  IconAlertCircle,
} from "@tabler/icons-react";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Original values for comparison
  const [originalValues, setOriginalValues] = useState({
    full_name: "",
    phone: "",
    email: "",
  });

  const [profileForm, setProfileForm] = useState({
    full_name: "",
    phone: "",
  });

  const [emailForm, setEmailForm] = useState({
    email: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    new_password: "",
    confirm_password: "",
  });

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error || !user) {
        router.replace("/login");
        return;
      }

      setUser(user);
      const fullName = user.user_metadata?.full_name || "";
      const phone = user.user_metadata?.phone || "";
      const email = user.email || "";

      setOriginalValues({
        full_name: fullName,
        phone: phone,
        email: email,
      });

      setProfileForm({
        full_name: fullName,
        phone: phone,
      });
      setEmailForm({
        email: email,
      });
      setLoading(false);
    }
    getUser();
  }, [router]);

  // Check if profile form has changes
  const hasProfileChanges = () => {
    return (
      profileForm.full_name !== originalValues.full_name ||
      profileForm.phone !== originalValues.phone
    );
  };

  // Check if email form has changes
  const hasEmailChanges = () => {
    return emailForm.email !== originalValues.email;
  };

  // Check if password form has changes
  const hasPasswordChanges = () => {
    return (
      passwordForm.new_password !== "" || passwordForm.confirm_password !== ""
    );
  };

  const updateProfile = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: profileForm.full_name,
          phone: profileForm.phone,
        },
      });

      if (error) throw error;

      setMessage({ type: "success", text: "Profile updated successfully!" });

      // Update original values after successful save
      setOriginalValues((prev) => ({
        ...prev,
        full_name: profileForm.full_name,
        phone: profileForm.phone,
      }));

      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  };

  const updateEmail = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const { error } = await supabase.auth.updateUser({
        email: emailForm.email,
      });

      if (error) throw error;

      setMessage({
        type: "success",
        text: "Email update initiated. Please check your email to confirm the change.",
      });

      // Update original values after successful save
      setOriginalValues((prev) => ({
        ...prev,
        email: emailForm.email,
      }));
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  };

  const updatePassword = async () => {
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    if (passwordForm.new_password.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters long",
      });
      return;
    }

    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.new_password,
      });

      if (error) throw error;

      setMessage({ type: "success", text: "Password updated successfully!" });
      setPasswordForm({
        new_password: "",
        confirm_password: "",
      });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingOverlay visible={true} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <Title order={1} className="text-3xl font-bold text-gray-900 mb-2">
          Account Settings
        </Title>
        <Text className="text-gray-600">
          Manage your account information and security settings
        </Text>
      </div>

      {message.text && (
        <Alert
          icon={
            message.type === "success" ? (
              <IconCheck size={16} />
            ) : (
              <IconAlertCircle size={16} />
            )
          }
          title={message.type === "success" ? "Success" : "Error"}
          color={message.type === "success" ? "green" : "red"}
          variant="light"
          className="mb-6"
        >
          {message.text}
        </Alert>
      )}

      {/* Profile Information */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <div className="flex items-center gap-3 mb-6">
          <IconUser className="w-6 h-6 text-primary" />
          <Title order={2} className="text-xl font-semibold">
            Profile Information
          </Title>
        </div>

        <Stack gap="md">
          <TextInput
            label="Full Name"
            placeholder="Enter your full name"
            value={profileForm.full_name}
            onChange={(e) =>
              setProfileForm({ ...profileForm, full_name: e.target.value })
            }
            leftSection={<IconUser size={16} />}
          />

          <TextInput
            label="Phone Number"
            placeholder="Enter your phone number"
            value={profileForm.phone}
            onChange={(e) =>
              setProfileForm({ ...profileForm, phone: e.target.value })
            }
            leftSection={<IconPhone size={16} />}
          />

          <Group justify="flex-end">
            <Button
              onClick={updateProfile}
              loading={saving}
              disabled={!hasProfileChanges()}
              className="bg-primary hover:bg-primary/90"
            >
              Update Profile
            </Button>
          </Group>
        </Stack>
      </Card>

      {/* Email Settings */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <div className="flex items-center gap-3 mb-6">
          <IconMail className="w-6 h-6 text-primary" />
          <Title order={2} className="text-xl font-semibold">
            Email Address
          </Title>
        </div>

        <Stack gap="md">
          <TextInput
            label="Email Address"
            placeholder="Enter your email address"
            value={emailForm.email}
            onChange={(e) =>
              setEmailForm({ ...emailForm, email: e.target.value })
            }
            leftSection={<IconMail size={16} />}
            type="email"
          />

          <Text size="sm" c="dimmed">
            You'll receive a confirmation email to verify your new email
            address.
          </Text>

          <Group justify="flex-end">
            <Button
              onClick={updateEmail}
              loading={saving}
              disabled={!hasEmailChanges()}
              className="bg-primary hover:bg-primary/90"
            >
              Update Email
            </Button>
          </Group>
        </Stack>
      </Card>

      {/* Password Settings */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <div className="flex items-center gap-3 mb-6">
          <IconLock className="w-6 h-6 text-primary" />
          <Title order={2} className="text-xl font-semibold">
            Change Password
          </Title>
        </div>

        <Stack gap="md">
          <PasswordInput
            label="New Password"
            placeholder="Enter your new password"
            value={passwordForm.new_password}
            onChange={(e) =>
              setPasswordForm({ ...passwordForm, new_password: e.target.value })
            }
            leftSection={<IconLock size={16} />}
          />

          <PasswordInput
            label="Confirm New Password"
            placeholder="Confirm your new password"
            value={passwordForm.confirm_password}
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,
                confirm_password: e.target.value,
              })
            }
            leftSection={<IconLock size={16} />}
          />

          <Text size="sm" c="dimmed">
            Password must be at least 6 characters long.
          </Text>

          <Group justify="flex-end">
            <Button
              onClick={updatePassword}
              loading={saving}
              disabled={!hasPasswordChanges()}
              className="bg-primary hover:bg-primary/90"
            >
              Update Password
            </Button>
          </Group>
        </Stack>
      </Card>
    </div>
  );
}
